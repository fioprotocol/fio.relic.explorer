import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from 'src/config/database';
import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_OFFSET,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { AccountDomainResponse } from '@shared/types/accounts';

interface AccountDomainsParams {
  Params: {
    account: string;
  };
  Querystring: {
    limit?: number;
    offset?: number;
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
          offset: { type: 'integer', default: DEFAULT_REQUEST_ITEMS_OFFSET, minimum: 0 },
          limit: {
            type: 'integer',
            default: DEFAULT_REQUEST_ITEMS_LIMIT,
            minimum: 1,
            maximum: DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
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
                  domain_name: { type: 'string' },
                  is_public: { type: 'boolean' },
                  handles_count: { type: 'number' },
                  status: { type: 'string' },
                  expiration_timestamp: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
          },
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      },
      tags: ['Accounts'],
      summary: 'Account FIO Domains',
      description: 'Get FIO domains for a specific account',
    },
  };

  server.get<AccountDomainsParams>(
    '/',
    getDomainsOpts,
    async (
      request: FastifyRequest<AccountDomainsParams>,
      reply: FastifyReply
    ): Promise<AccountDomainResponse> => {
      const { account } = request.params;
      const { limit, offset } = request.query;

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
            data: [],
            total: 0,
            error: 'Account not found'
          } as any;
        }

        const accountId = accountResult.rows[0].pk_account_id;

        // Query to get domains for the account
        const domainsQuery = {
          text: `
            SELECT 
              d.domain_name,
              d.is_public,
              d.domain_status as status,
              d.expiration_timestamp,
              (
                SELECT COUNT(*) 
                FROM handles h 
                WHERE h.fk_domain_id = d.pk_domain_id
              ) as handles_count
            FROM domains d
            WHERE d.fk_owner_account_id = $1
            ORDER BY d.domain_name ASC
            LIMIT $2
            OFFSET $3
          `,
          values: [accountId, limit, offset],
        };

        // Count query
        const countQuery = {
          text: `
            SELECT COUNT(*) as total
            FROM domains
            WHERE fk_owner_account_id = $1
          `,
          values: [accountId],
        };

        const [domainsResult, countResult] = await Promise.all([
          pool.query(domainsQuery),
          pool.query(countQuery),
        ]);

        return {
          data: domainsResult.rows,
          total: parseInt(countResult.rows[0].total),
        };
      } catch (error) {
        console.error('Error fetching account FIO domains:', error);
        reply.code(500);
        return {
          data: [],
          total: 0,
          error: 'Failed to fetch account FIO domains',
        } as any;
      }
    }
  );
};

export default accountDomainsRoute; 
