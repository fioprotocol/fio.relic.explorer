import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from 'src/config/database';
import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_OFFSET,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { AccountFioHandlesResponse } from '@shared/types/accounts';

interface AccountFioHandlesParams {
  Params: {
    account: string;
  };
  Querystring: {
    limit?: number;
    offset?: number;
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
                  handle: { type: 'string' },
                  handle_status: { type: 'string' },
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
      summary: 'Account FIO Handles',
      description: 'Get FIO handles for a specific account',
    },
  };

  server.get<AccountFioHandlesParams>(
    '/',
    getFioHandlesOpts,
    async (
      request: FastifyRequest<AccountFioHandlesParams>,
      reply: FastifyReply
    ): Promise<AccountFioHandlesResponse> => {
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

        // Query to get handles for the account
        const handlesQuery = {
          text: `
            SELECT 
              handle,
              handle_status
            FROM handles
            WHERE fk_owner_account_id = $1
            ORDER BY handle ASC
            LIMIT $2
            OFFSET $3
          `,
          values: [accountId, limit, offset],
        };

        // Count query
        const countQuery = {
          text: `
            SELECT COUNT(*) as total
            FROM handles
            WHERE fk_owner_account_id = $1
          `,
          values: [accountId],
        };

        const [handlesResult, countResult] = await Promise.all([
          pool.query(handlesQuery),
          pool.query(countQuery),
        ]);

        return {
          data: handlesResult.rows,
          total: parseInt(countResult.rows[0].total),
        };
      } catch (error) {
        console.error('Error fetching account FIO handles:', error);
        reply.code(500);
        return {
          data: [],
          total: 0,
          error: 'Failed to fetch account FIO handles',
        } as any;
      }
    }
  );
};

export default accountFioHandlesRoute; 
