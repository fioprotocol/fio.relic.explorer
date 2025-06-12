import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import {
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { CursorHandlesResponse, Handle } from '@shared/types/handles';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';
import { CursorPagination } from 'src/utils/cursorPagination';

interface HandlesQuery {
  Querystring: {
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
            // Response fields
            total: { type: 'number' },
            active: { type: 'number' },
            // Cursor pagination response fields
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
            nextCursor: { type: ['string', 'null'] },
            prevCursor: { type: ['string', 'null'] },
          },
        },
      },
      tags: ['handle'],
      summary: 'Get handles with cursor pagination',
      description: 'Get handles using cursor-based pagination for optimal performance',
    },
  };

  server.get<HandlesQuery>(
    '/',
    getHandlesOpts,
    async (request: FastifyRequest<HandlesQuery>, reply: FastifyReply) => {
      const {
        // Cursor pagination parameters
        cursor,
        direction = PAGINATION_DIRECTIONS.NEXT,
        // Common parameters
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        include_total = false,
      } = request.query;

      try {
        // Always use cursor-based pagination
        const selectColumns = `
          h.pk_handle_id,
          h.handle,
          h.encryption_key,
          h.is_encrypt_key_set,
          h.expiration_stamp,
          h.handle_status,
          a.account_name as owner_account_name,
          a.pk_account_id as owner_account_id,
          d.domain_name
        `;

        const joinClause = `
          LEFT JOIN accounts a ON h.fk_owner_account_id = a.pk_account_id
          LEFT JOIN domains d ON h.fk_domain_id = d.pk_domain_id
        `;

        const result = await CursorPagination.paginate<Handle>({
          table: 'handles h',
          cursorColumn: 'h.pk_handle_id',
          orderDirection: 'DESC',
          limit,
          cursor, // may be undefined
          direction,
          selectColumns,
          joinClause,
        });

        // Optionally compute totals
        let total: number | undefined;
        let active: number | undefined;

        if (include_total) {
          const [totalCount, activeCount] = await Promise.all([
            CursorPagination.getTotalCount({ table: 'handles' }),
            CursorPagination.getTotalCount({
              table: 'handles',
              whereClause: "handle_status = 'active'",
            }),
          ]);

          total = totalCount;
          active = activeCount;
        }

        const response: CursorHandlesResponse = {
          data: result.data,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          nextCursor: result.nextCursor,
          prevCursor: result.prevCursor,
          ...(total !== undefined && { total }),
          ...(active !== undefined && { active }),
        };

        return response;
      } catch (error) {
        fastify.log.error('Error in handles pagination:', error);
        reply.code(500).send({ error: 'Internal server error' });
        return;
      }
    }
  );
};

export default blocksRoute;
