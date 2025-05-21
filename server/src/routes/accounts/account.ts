import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from '../../config/database';
import { AccountDetails } from '@shared/types/accounts';

interface AccountParams {
  Params: {
    account: string;
  };
}

const accountRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Get account by ID endpoint
  const getAccountByIdOpts: RouteShorthandOptions = {
    schema: {
      params: {
        type: 'object',
        required: ['account'],
        properties: {
          account: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                pk_account_id: { type: 'number' },
                account_name: { type: 'string' },
                handle_count: { type: 'number' },
                domain_count: { type: 'number' },
                fio_balance_suf: { type: 'string' },
                block_timestamp: { type: 'string' },
                public_key: { type: 'string' },
                fk_block_number: { type: 'number' },
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      },
      tags: ['accounts'],
      summary: 'Get account by account name',
      description: 'Get a specific account by its account name',
    },
  };

  server.get<AccountParams>(
    '/',
    getAccountByIdOpts,
    async (request: FastifyRequest<AccountParams>, reply: FastifyReply) => {
      const { account } = request.params;

      const query = {
        text: `
          SELECT
            a.pk_account_id,
            a.account_name,
            a.fio_balance_suf,
            a.block_timestamp,
            a.public_key,
            a.fk_block_number,
            (
              SELECT COUNT(*)
              FROM handles h
              WHERE h.fk_owner_account_id = a.pk_account_id
            ) as handle_count,
            (
              SELECT COUNT(*)
              FROM domains d
              WHERE d.fk_owner_account_id = a.pk_account_id
            ) as domain_count
          FROM accounts a
          WHERE a.account_name = $1
        `,
        values: [account]
      };

      const result = await pool.query(query);

      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'Account not found' };
      }

      return { data: result.rows[0] as AccountDetails };
    }
  );
};

export default accountRoute;
