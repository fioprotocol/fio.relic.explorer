import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from 'src/config/database';
import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';

import { CursorPagination } from 'src/utils/cursorPagination';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';

import { AccounFioHandle } from '@shared/types/accounts';
import { CursorResponse } from '@shared/types/general';

interface AccountFioHandlesParams {
  Params: {
    account: string;
  };
  Querystring: {
    limit?: number;
    cursor?: string;
    direction?: PaginationDirection;
    include_total?: boolean;
  };
}

const accountFioHandlesRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getFioHandlesOpts: RouteShorthandOptions = {
    schema: {
      params: {
        type: 'object',
        properties: {
          account: { type: 'string' },
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
                  handle: { type: 'string' },
                  handle_status: { type: 'string' },
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
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
      tags: ['Accounts'],
      summary: 'Account FIO Handles with cursor pagination',
      description: 'Get FIO handles for a specific account using cursor-based pagination',
    },
  };

  server.get<AccountFioHandlesParams>(
    '/',
    getFioHandlesOpts,
    async (
      request: FastifyRequest<AccountFioHandlesParams>,
      reply: FastifyReply
    ): Promise<CursorResponse<{ data: AccounFioHandle[] }>> => {
      const { account } = request.params;
      const {
        cursor,
        direction = PAGINATION_DIRECTIONS.NEXT,
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        include_total = false,
      } = request.query;

      // Get account ID first
      const accountIdQuery = {
        text: `
          SELECT pk_account_id
          FROM accounts
          WHERE account_name = $1
        `,
        values: [account],
      };

      try {
        const accountResult = await pool.query(accountIdQuery);

        if (accountResult.rows.length === 0) {
          reply.code(404);
          return {
            message: "Account's handles not found",
          } as any;
        }

        const accountId = accountResult.rows[0].pk_account_id;

        // Use cursor pagination on handles table
        const selectColumns = `
          h.pk_handle_id,
          h.handle,
          h.handle_status
        `;

        const result = await CursorPagination.paginate<AccounFioHandle & { pk_handle_id: number }>({
          table: 'handles h',
          cursorColumn: 'h.pk_handle_id',
          orderDirection: 'DESC',
          limit,
          cursor,
          direction,
          whereClause: 'h.fk_owner_account_id = $1',
          whereValues: [accountId],
          selectColumns,
        });

        let total: number | undefined;
        if (include_total) {
          total = await CursorPagination.getTotalCount({
            table: 'handles h',
            whereClause: 'h.fk_owner_account_id = $1',
            whereValues: [accountId],
          });
        }

        const data = result.data.map(({ handle, handle_status }) => ({ handle, handle_status }));

        const response: CursorResponse<{ data: AccounFioHandle[] }> = {
          data,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          nextCursor: result.nextCursor,
          prevCursor: result.prevCursor,
          ...(total !== undefined && { total }),
        };

        return reply.send(response);
      } catch (error) {
        console.error('Error fetching account FIO handles:', error);
        return reply.code(500).send({ message: 'Internal server error' });
      }
    }
  );
};

export default accountFioHandlesRoute;
