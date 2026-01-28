import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from 'src/config/database';
import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';

import { CursorPagination } from 'src/utils/cursorPagination';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';

import { AccountDomain } from '@shared/types/accounts';
import { CursorResponse } from '@shared/types/general';

interface AccountDomainsParams {
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

const accountDomainsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getDomainsOpts: RouteShorthandOptions = {
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
                  domain_name: { type: 'string' },
                  is_public: { type: 'boolean' },
                  handles_count: { type: 'number' },
                  status: { type: 'string' },
                  expiration_timestamp: { type: 'string' },
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
      summary: 'Account FIO Domains with cursor pagination',
      description: 'Get FIO domains for a specific account using cursor-based pagination',
    },
  };

  server.get<AccountDomainsParams>(
    '/',
    getDomainsOpts,
    async (
      request: FastifyRequest<AccountDomainsParams>,
      reply: FastifyReply
    ): Promise<CursorResponse<{ data: AccountDomain[] }>> => {
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
            message: "Account's domains not found",
          } as any;
        }

        const accountId = accountResult.rows[0].pk_account_id;

        const selectColumns = `
          d.pk_domain_id,
          d.domain_name,
          d.is_public,
          d.domain_status as status,
          d.expiration_timestamp,
          (
            SELECT COUNT(*) FROM handles h WHERE h.fk_domain_id = d.pk_domain_id
          ) as handles_count
        `;

        const result = await CursorPagination.paginate<AccountDomain & { pk_domain_id: number }>({
          table: 'domains d',
          cursorColumn: 'd.pk_domain_id',
          orderDirection: 'DESC',
          limit,
          cursor,
          direction,
          whereClause: 'd.fk_owner_account_id = $1',
          whereValues: [accountId],
          selectColumns,
        });

        let total: number | undefined;
        if (include_total) {
          total = await CursorPagination.getTotalCount({
            table: 'domains d',
            whereClause: 'd.fk_owner_account_id = $1',
            whereValues: [accountId],
          });
        }

        const data = result.data.map(
          ({ domain_name, is_public, status, expiration_timestamp, handles_count }) => ({
            domain_name,
            is_public,
            status,
            expiration_timestamp,
            handles_count,
          })
        );

        const response: CursorResponse<{ data: AccountDomain[] }> = {
          data,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          nextCursor: result.nextCursor,
          prevCursor: result.prevCursor,
          ...(total !== undefined && { total }),
        };

        return reply.send(response);
      } catch (error) {
        console.error('Error fetching account FIO domains:', error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
};

export default accountDomainsRoute;
