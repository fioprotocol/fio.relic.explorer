import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import {
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { AccountsResponse, AccountSortOption } from '@shared/types/accounts';
import { ACCOUNT_SORT_OPTIONS } from '@shared/constants/accounts';

interface AccountsQuery {
  Querystring: {
    offset?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sort?: AccountSortOption;
  };
}

const accountsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getAccountsOpts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          offset: { type: 'number', default: 0 },
          limit: {
            type: 'number',
            default: DEFAULT_REQUEST_ITEMS_LIMIT,
            maximum: DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
          },
          order: { type: 'string', enum: ['asc', 'desc'] },
          sort: {
            type: 'string',
            default: ACCOUNT_SORT_OPTIONS.ACCOUNT_ID,
            enum: Object.values(ACCOUNT_SORT_OPTIONS),
          },
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
                  pk_account_id: { type: 'number' },
                  account_name: { type: 'string' },
                  handle_count: { type: 'number' },
                  domain_count: { type: 'number' },
                  fio_balance_suf: { type: 'string' },
                  block_timestamp: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
          },
        },
      },
      tags: ['accounts'],
      summary: 'Accounts',
      description: 'Get accounts list',
    },
  };

  server.get<AccountsQuery>(
    '/',
    getAccountsOpts,
    async (
      request: FastifyRequest<AccountsQuery>,
      reply: FastifyReply
    ): Promise<AccountsResponse> => {
      const {
        offset = 0,
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        sort = ACCOUNT_SORT_OPTIONS.ACCOUNT_ID,
      } = request.query;

      let order = request.query.order;
      if (!order) {
        order = 'desc';
      }

      const sqlQuery = `
        SELECT
          a.pk_account_id,
          a.account_name,
          a.fio_balance_suf,
          a.block_timestamp,
          COUNT(DISTINCT h.pk_handle_id) as handle_count,
          COUNT(DISTINCT d.pk_domain_id) as domain_count
        FROM accounts a
        LEFT JOIN handles h ON a.pk_account_id = h.fk_owner_account_id
        LEFT JOIN domains d ON a.pk_account_id = d.fk_owner_account_id
        GROUP BY a.pk_account_id, a.account_name, a.fio_balance_suf, a.block_timestamp
        ORDER BY ${sort} ${order}
        LIMIT $1
        OFFSET $2
      `;

      // Query for total count
      const countQuery = {
        text: `
        SELECT COUNT(*) as total
        FROM accounts
      `,
        values: [],
      };

      const [accountsResult, countResult] = await Promise.all([
        pool.query(sqlQuery, [limit, offset]),
        pool.query(countQuery),
      ]);

      return {
        data: accountsResult.rows,
        total: parseInt(countResult.rows[0].total),
      };
    }
  );
};

export default accountsRoute; 
