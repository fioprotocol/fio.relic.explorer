import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from 'src/config/database';
import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_OFFSET,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { AccountTransactionsResponse } from '@shared/types/accounts';

interface AccountTransactionsQuery {
  Params: {
    account: string;
  };
  Querystring: {
    limit: number;
    offset: number;
  };
}

const accountTransactionsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getTransactionsOpts: RouteShorthandOptions = {
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
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pk_transaction_id: { type: 'number' },
                  transaction_id: { type: 'string' },
                  block_timestamp: { type: 'string' },
                  action_name: { type: 'string' },
                  fee: { type: 'string' },
                  fio_tokens: { type: ['string', 'null'] },
                  transaction_type: { type: 'string' }, // SENDER or RECEIVER
                  request_data: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
          },
        },
      },
      tags: ['Accounts'],
      summary: 'Account Transactions',
      description: 'Get transactions for a specific account',
    },
  };

  server.get<AccountTransactionsQuery>(
    '/',
    getTransactionsOpts,
    async (
      request: FastifyRequest<AccountTransactionsQuery>,
      reply: FastifyReply
    ): Promise<AccountTransactionsResponse> => {
      const { account } = request.params;
      const { limit, offset } = request.query;

      // Query to get transactions where account is sender or receiver
      const transactionsQuery = {
        text: `
          WITH account_info AS (
            SELECT pk_account_id 
            FROM accounts 
            WHERE account_name = $1
          ),
          
          all_transactions AS (
            -- Sender transactions (where fk_account_id = account's pk_account_id)
            SELECT 
              t.pk_transaction_id,
              t.transaction_id,
              t.block_timestamp,
              t.action_name,
              t.fee,
              t.request_data,
              'SENDER' as transaction_type,
              (SELECT SUM(tt.fio_suf_amount)
               FROM tokentransfers tt 
               WHERE tt.fk_payer_account_id = (SELECT pk_account_id FROM account_info) 
               AND tt.fk_transaction_id = t.pk_transaction_id) as fio_tokens
            FROM transactions t
            WHERE t.fk_account_id = (SELECT pk_account_id FROM account_info)
            
            UNION ALL
            
            -- Receiver transactions (via accountactivities)
            SELECT 
              t.pk_transaction_id,
              t.transaction_id,
              t.block_timestamp,
              t.action_name,
              t.fee,
              t.request_data,
              'RECEIVER' as transaction_type,
              (SELECT SUM(tt.fio_suf_amount)
               FROM tokentransfers tt
               WHERE tt.fk_payee_account_id = (SELECT pk_account_id FROM account_info) 
               AND tt.fk_transaction_id = t.pk_transaction_id) as fio_tokens
            FROM transactions t
            JOIN accountactivities aa ON t.pk_transaction_id = aa.fk_transaction_id
            WHERE aa.fk_account_id = (SELECT pk_account_id FROM account_info)
          )
          
          SELECT 
            pk_transaction_id,
            transaction_id,
            block_timestamp,
            action_name,
            fee,
            fio_tokens::text,
            transaction_type,
            request_data
          FROM all_transactions
          ORDER BY pk_transaction_id DESC
          LIMIT $2
          OFFSET $3
        `,
        values: [account, limit, offset],
      };

      // Simplified count query
      const countQuery = {
        text: `
          WITH account_info AS (
            SELECT pk_account_id 
            FROM accounts 
            WHERE account_name = $1
          )
          
          SELECT 
            (
              SELECT COUNT(*) 
              FROM transactions 
              WHERE fk_account_id = (SELECT pk_account_id FROM account_info)
            ) +
            (
              SELECT COUNT(*) 
              FROM transactions t
              JOIN accountactivities aa ON t.pk_transaction_id = aa.fk_transaction_id
              WHERE aa.fk_account_id = (SELECT pk_account_id FROM account_info)
            ) as total
        `,
        values: [account],
      };

      try {
        const [transactionsResult, countResult] = await Promise.all([
          pool.query(transactionsQuery),
          pool.query(countQuery),
        ]);

        return {
          transactions: transactionsResult.rows,
          total: parseInt(countResult.rows[0].total),
        };
      } catch (error) {
        console.error('Error fetching account transactions:', error);
        reply.code(500);
        return {
          transactions: [],
          total: 0,
          error: 'Failed to fetch account transactions',
        } as any;
      }
    }
  );
};

export default accountTransactionsRoute;
