import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';

import { CursorPagination } from 'src/utils/cursorPagination';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';

import { HandleTransaction } from '@shared/types/handles';
import { CursorResponse } from '@shared/types/general';

interface HandleTransactionsQuery {
  Params: {
    handle: string;
  };
  Querystring: {
    limit?: number;
    cursor?: string;
    direction?: PaginationDirection;
    include_total?: boolean;
  };
}

const handleTransactionsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Cursor-based pagination endpoint
  const getTransactionsOpts: RouteShorthandOptions = {
    schema: {
      params: {
        type: 'object',
        properties: {
          handle: { type: 'string' },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          cursor: { type: 'string' },
          direction: {
            type: 'string',
            enum: [PAGINATION_DIRECTIONS.NEXT, PAGINATION_DIRECTIONS.PREV],
            default: PAGINATION_DIRECTIONS.NEXT,
          },
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
                  pk_handle_activity_id: { type: 'number' },
                  handle_activity_type: { type: 'string' },
                  block_timestamp: { type: 'string' },
                  transaction_id: { type: 'string' },
                  action_name: { type: 'string' },
                  tpid: { type: 'string' },
                  fee: { type: 'string' },
                  result_status: { type: 'string' },
                  account_name: { type: 'string' },
                },
              },
            },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
            nextCursor: { type: ['string', 'null'] },
            prevCursor: { type: ['string', 'null'] },
            total: { type: 'number' },
          },
          required: ['data', 'hasNextPage', 'hasPrevPage', 'nextCursor', 'prevCursor'],
        },
      },
      tags: ['Handles'],
      summary: 'Handle Transactions with cursor pagination',
      description: 'Get handle transactions using cursor-based pagination',
    },
  };

  server.get<HandleTransactionsQuery>(
    '/',
    getTransactionsOpts,
    async (
      request: FastifyRequest<HandleTransactionsQuery>,
      reply: FastifyReply
    ): Promise<CursorResponse<{ data: HandleTransaction[] }>> => {
      const {
        cursor,
        direction = PAGINATION_DIRECTIONS.NEXT,
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        include_total = false,
      } = request.query;

      const { handle } = request.params;

      try {
        const selectColumns = `
          ha.pk_handle_activity_id,
          ha.handle_activity_type,
          ha.block_timestamp,
          t.transaction_id,
          t.action_name,
          t.tpid,
          t.fee,
          t.result_status,
          a.account_name
        `;

        const joinClause = `
          JOIN handles h ON ha.fk_handle_id = h.pk_handle_id
          JOIN transactions t ON ha.fk_transaction_id = t.pk_transaction_id
          LEFT JOIN accounts a ON t.fk_account_id = a.pk_account_id
        `;

        const whereClause = 'h.handle = $1';
        const whereValues = [handle];

        const result = await CursorPagination.paginate<HandleTransaction>({
          table: 'handleactivities ha',
          cursorColumn: 'ha.pk_handle_activity_id',
          orderDirection: 'DESC',
          limit,
          cursor,
          direction,
          whereClause,
          whereValues,
          selectColumns,
          joinClause,
        });

        let total: number | undefined;
        if (include_total) {
          total = await CursorPagination.getTotalCount({
            table: 'handleactivities ha',
            joinClause,
            whereClause,
            whereValues,
          });
        }

        const response: CursorResponse<{ data: HandleTransaction[] }> = {
          data: result.data,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          nextCursor: result.nextCursor,
          prevCursor: result.prevCursor,
          ...(total !== undefined && { total }),
        };

        return reply.send(response);
      } catch (error) {
        fastify.log.error('Error fetching handle transactions with cursor pagination:', error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
};

export default handleTransactionsRoute;
