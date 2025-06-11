import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import {
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_OFFSET,
} from '@shared/constants/network';
import { HandlesResponse, CursorHandlesResponse, Handle } from '@shared/types/handles';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';
import { AnyObject } from '@shared/types/general';

interface HandlesQuery {
  Querystring: {
    offset?: number;
    limit?: number;
    cursor?: string;
    direction?: PaginationDirection;
    include_total?: boolean;
  };
}

const blocksRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Health check endpoint
  const getHandlesOpts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          // Offset-based pagination (legacy support)
          offset: { type: 'integer', default: DEFAULT_REQUEST_ITEMS_OFFSET, minimum: 0 },
          // Cursor-based pagination
          cursor: { type: 'string' },
          direction: {
            type: 'string',
            enum: [PAGINATION_DIRECTIONS.NEXT, PAGINATION_DIRECTIONS.PREV],
            default: PAGINATION_DIRECTIONS.NEXT,
          },
          // Common parameters
          limit: {
            type: 'integer',
            default: DEFAULT_REQUEST_ITEMS_LIMIT,
            minimum: 1,
            maximum: DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
          },
          include_total: { type: 'boolean', default: false },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pk_handle_id: { type: 'number' },
                  handle: { type: 'string' },
                  encryption_key: { type: 'string' },
                  is_encrypt_key_set: { type: 'boolean' },
                  bundled_tx_count: { type: 'number' },
                  expiration_stamp: { type: 'string' },
                  handle_status: { type: 'string' },
                  owner_account_name: { type: 'string' },
                  owner_account_id: { type: 'string' },
                  domain_name: { type: 'string' },
                },
              },
            },
            // Offset pagination response fields
            total: { type: 'number' },
            all: { type: 'number' },
            active: { type: 'number' },
            offset: { type: 'number' },
            limit: { type: 'number' },
            // Cursor pagination response fields
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
            nextCursor: { type: ['string', 'null'] },
            prevCursor: { type: ['string', 'null'] },
          },
        },
      },
      tags: ['handle'],
      summary: 'Get handles with offset/cursor pagination',
      description:
        'Get handles using either offset-based (legacy) or cursor-based pagination for optimal performance',
    },
  };

  server.get<HandlesQuery>(
    '/',
    getHandlesOpts,
    async (request: FastifyRequest<HandlesQuery>, reply: FastifyReply) => {
      const {
        // Offset pagination parameters
        offset = DEFAULT_REQUEST_ITEMS_OFFSET,
        // Cursor pagination parameters
        cursor,
        direction = PAGINATION_DIRECTIONS.NEXT,
        // Common parameters
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        include_total = false,
      } = request.query;

      try {
        // Determine pagination mode: use cursor pagination when cursor is provided
        // or when offset is not explicitly provided (defaults to cursor for performance)
        const originalQuery = (request.raw as AnyObject).url.split('?')[1] || '';
        const urlParams = new URLSearchParams(originalQuery);
        const isOffsetExplicitlyProvided = urlParams.has('offset');
        const useCursorPagination = cursor !== undefined || !isOffsetExplicitlyProvided;

        if (useCursorPagination) {
          // Use cursor-based pagination for optimal performance
          let cursorCondition = '';
          let queryValues: (string | number)[] = [];

          if (cursor) {
            const paramIndex = queryValues.length + 1;
            if (direction === PAGINATION_DIRECTIONS.NEXT) {
              cursorCondition = `WHERE h.pk_handle_id < $${paramIndex}`;
            } else {
              cursorCondition = `WHERE h.pk_handle_id > $${paramIndex}`;
            }
            queryValues.push(cursor);
          }

          const orderDirection = direction === PAGINATION_DIRECTIONS.PREV ? 'ASC' : 'DESC';

          const query = `
            SELECT
              h.pk_handle_id,
              h.handle,
              h.encryption_key,
              h.is_encrypt_key_set,
              h.expiration_stamp,
              h.handle_status,
              a.account_name as owner_account_name,
              a.pk_account_id as owner_account_id,
              d.domain_name
            FROM
              handles h
              LEFT JOIN accounts a ON h.fk_owner_account_id = a.pk_account_id
              LEFT JOIN domains d ON h.fk_domain_id = d.pk_domain_id
            ${cursorCondition}
            ORDER BY h.pk_handle_id ${orderDirection}
            LIMIT ${limit + 1}
          `;

          const result = await pool.query(query, queryValues);
          let rows = result.rows as Handle[];

          // Determine pagination info
          const hasMorePages = rows.length > limit;
          if (hasMorePages) {
            rows = rows.slice(0, limit);
          }

          // For previous direction, reverse the results to maintain correct order
          if (direction === PAGINATION_DIRECTIONS.PREV) {
            rows.reverse();
          }

          // Calculate navigation state
          let hasNextPage: boolean;
          let hasPrevPage: boolean;

          if (direction === PAGINATION_DIRECTIONS.NEXT) {
            hasNextPage = hasMorePages;
            hasPrevPage = !!cursor;
          } else {
            hasNextPage = !!cursor;
            hasPrevPage = hasMorePages;
          }

          const nextCursor =
            hasNextPage && rows.length > 0 ? String(rows[rows.length - 1].pk_handle_id) : null;
          const prevCursor = hasPrevPage && rows.length > 0 ? String(rows[0].pk_handle_id) : null;

          // Optionally get total counts (expensive operation)
          let total: number | undefined;
          let all: number | undefined;
          let active: number | undefined;

          if (include_total) {
            const countQuery = `SELECT COUNT(*) as total FROM handles`;
            const activeQuery = `SELECT COUNT(*) as total FROM handles WHERE handle_status = 'active'`;

            const [countResult, activeResult] = await Promise.all([
              pool.query(countQuery),
              pool.query(activeQuery),
            ]);

            total = parseInt(countResult.rows[0].total);
            all = total;
            active = parseInt(activeResult.rows[0].total);
          }

          const response: CursorHandlesResponse = {
            data: rows,
            hasNextPage,
            hasPrevPage,
            nextCursor,
            prevCursor,
            ...(total !== undefined && { total }),
            ...(all !== undefined && { all }),
            ...(active !== undefined && { active }),
          };

          return response;
        } else {
          // Legacy offset-based pagination for backward compatibility
          const sqlQuery = `
            SELECT
              h.pk_handle_id,
              h.handle,
              h.encryption_key,
              h.is_encrypt_key_set,
              h.expiration_stamp,
              h.handle_status,
              a.account_name as owner_account_name,
              a.pk_account_id as owner_account_id,
              d.domain_name
            FROM
              handles h
              LEFT JOIN accounts a ON h.fk_owner_account_id = a.pk_account_id
              LEFT JOIN domains d ON h.fk_domain_id = d.pk_domain_id
            ORDER BY h.pk_handle_id DESC
            LIMIT $1
            OFFSET $2
          `;

          // Query for total count
          const countQuery = {
            text: `SELECT COUNT(*) as total FROM handles`,
            values: [],
          };
          const activeQuery = {
            text: `SELECT COUNT(*) as total FROM handles WHERE handle_status = 'active'`,
            values: [],
          };

          const [handlesResult, countResult, activeResult] = await Promise.all([
            pool.query(sqlQuery, [limit, offset]),
            pool.query(countQuery),
            pool.query(activeQuery),
          ]);

          const total = parseInt(countResult.rows[0].total);
          const active = parseInt(activeResult.rows[0].total);

          const response: HandlesResponse = {
            data: handlesResult.rows,
            total,
            all: total,
            active,
          };

          return response;
        }
      } catch (error) {
        fastify.log.error('Error in handles pagination:', error);
        reply.code(500).send({ error: 'Internal server error' });
        return;
      }
    }
  );
};

export default blocksRoute;
