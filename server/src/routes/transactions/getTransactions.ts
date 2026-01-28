import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from '../../config/database';
import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_OFFSET,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import {
  TransactionResponse,
  CursorTransactionResponse,
  Transaction,
} from '@shared/types/transactions';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';
import { CursorPagination } from '../../utils/cursorPagination';
import { AnyObject } from '@shared/types/general';

const getTransactionsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Get transactions endpoint with support for both offset and cursor pagination
  const getTransactionsOpts: RouteShorthandOptions = {
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
          block_number: { type: 'integer' },
          include_total: { type: 'boolean', default: false },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pk_transaction_id: { type: 'string' },
                  fk_block_number: { type: 'number' },
                  block_timestamp: { type: 'string' },
                  transaction_id: { type: 'string' },
                  fk_action_account_id: { type: 'string' },
                  fk_account_id: { type: 'string' },
                  account_name: { type: 'string' },
                  action_name: { type: 'string' },
                  tpid: { type: 'string' },
                  fee: { type: 'number' },
                  request_data: { type: 'string' },
                  response_data: { type: 'string' },
                  result_status: { type: 'string' },
                },
              },
            },
            // Offset pagination response fields
            total: { type: 'number' },
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
      tags: ['transactions'],
      summary: 'Get transactions with offset/cursor pagination',
      description:
        'Get transactions using either offset-based (legacy) or cursor-based pagination for optimal performance',
    },
  };

  server.get('/', getTransactionsOpts, async (request: FastifyRequest, reply: FastifyReply) => {
    const {
      // Offset pagination parameters
      offset = DEFAULT_REQUEST_ITEMS_OFFSET,
      // Cursor pagination parameters
      cursor,
      direction = PAGINATION_DIRECTIONS.NEXT,
      // Common parameters
      limit = DEFAULT_REQUEST_ITEMS_LIMIT,
      block_number,
      include_total = false,
    } = request.query as {
      offset?: number;
      cursor?: string;
      direction?: PaginationDirection;
      limit?: number;
      block_number?: number;
      include_total?: boolean;
    };

    try {
      // Determine pagination mode: use cursor pagination when cursor is provided
      // or when offset is not explicitly provided (defaults to cursor for performance)
      const originalQuery = (request.raw as AnyObject).url.split('?')[1] || '';
      const urlParams = new URLSearchParams(originalQuery);
      const isOffsetExplicitlyProvided = urlParams.has('offset');
      const useCursorPagination = cursor !== undefined || !isOffsetExplicitlyProvided;

      if (useCursorPagination) {
        // Use cursor-based pagination for optimal performance
        const whereClause = block_number ? 't.fk_block_number = $1' : '';
        const whereValues: (string | number)[] = block_number ? [block_number] : [];

        let cursorCondition = '';
        let queryValues: (string | number)[] = [...whereValues];

        if (cursor) {
          const paramIndex = queryValues.length + 1;
          if (direction === PAGINATION_DIRECTIONS.NEXT) {
            cursorCondition = `AND t.pk_transaction_id < $${paramIndex}`;
          } else {
            cursorCondition = `AND t.pk_transaction_id > $${paramIndex}`;
          }
          queryValues.push(cursor);
        }

        const finalWhereClause = whereClause
          ? `WHERE ${whereClause} ${cursorCondition}`
          : cursorCondition
            ? `WHERE ${cursorCondition.substring(4)}` // Remove 'AND '
            : '';

        const orderDirection = direction === PAGINATION_DIRECTIONS.PREV ? 'ASC' : 'DESC';

        const query = `
          SELECT 
            t.pk_transaction_id, 
            t.fk_block_number, 
            t.block_timestamp, 
            t.transaction_id, 
            t.fk_action_account_id, 
            t.fk_account_id, 
            a.account_name, 
            t.action_name, 
            t.tpid, 
            t.fee, 
            t.request_data, 
            t.response_data, 
            t.result_status
          FROM transactions t
          LEFT JOIN accounts a ON t.fk_account_id = a.pk_account_id
          ${finalWhereClause}
          ORDER BY t.block_timestamp ${orderDirection}, t.pk_transaction_id ${orderDirection}
          LIMIT ${limit + 1}
        `;

        const result = await pool.query(query, queryValues);
        let rows = result.rows as Transaction[];

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
          hasNextPage && rows.length > 0 ? rows[rows.length - 1].pk_transaction_id : null;
        const prevCursor = hasPrevPage && rows.length > 0 ? rows[0].pk_transaction_id : null;

        // Optionally get total count (expensive operation)
        let total: number | undefined;
        if (include_total) {
          total = await CursorPagination.getTotalCount({
            table: 'transactions t',
            whereClause,
            whereValues,
            joinClause: 'LEFT JOIN accounts a ON t.fk_account_id = a.pk_account_id',
          });
        }

        const response: CursorTransactionResponse = {
          transactions: rows,
          hasNextPage,
          hasPrevPage,
          nextCursor,
          prevCursor,
          ...(total !== undefined && { total }),
        };

        return response;
      } else {
        // Legacy offset-based pagination for backward compatibility
        const transactionsQuery = {
          text: `
            SELECT 
              t.pk_transaction_id, 
              t.fk_block_number, 
              t.block_timestamp, 
              t.transaction_id, 
              t.fk_action_account_id, 
              t.fk_account_id, 
              a.account_name, 
              t.action_name, 
              t.tpid, 
              t.fee, 
              t.request_data, 
              t.response_data, 
              t.result_status
            FROM transactions t
            LEFT JOIN accounts a ON t.fk_account_id = a.pk_account_id
            ${block_number ? `WHERE t.fk_block_number = $3` : ''}
            ORDER BY t.block_timestamp DESC
            LIMIT $1 OFFSET $2
          `,
          values: block_number ? [limit, offset, block_number] : [limit, offset],
        };

        const countQuery = {
          text: `
            SELECT COUNT(pk_transaction_id) as total
            FROM transactions
            ${block_number ? `WHERE fk_block_number = $1` : ''}
          `,
          values: block_number ? [block_number] : [],
        };

        const [transactionsResult, countResult] = await Promise.all([
          pool.query(transactionsQuery),
          pool.query(countQuery),
        ]);

        const transactions = transactionsResult.rows as Transaction[];
        const total = parseInt(countResult.rows[0].total);

        const response: TransactionResponse = {
          transactions,
          total,
        };

        return response;
      }
    } catch (error) {
      fastify.log.error('Error in transaction pagination:', error);
      reply.code(500);
      return { message: 'Cannot fetch transactions' };
    }
  });
};

export default getTransactionsRoute;
