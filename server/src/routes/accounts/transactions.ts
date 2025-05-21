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

      try {
        // First get the account_id to avoid repeating this lookup
        const accountQuery = {
          text: 'SELECT pk_account_id FROM accounts WHERE account_name = $1',
          values: [account],
        };
        
        const accountResult = await pool.query(accountQuery);
        
        if (accountResult.rows.length === 0) {
          return {
            transactions: [],
            total: 0
          };
        }
        
        const accountId = accountResult.rows[0].pk_account_id;
        
        // Efficient combined query with pagination at the database level
        const paginatedTransactionsQuery = {
          text: `
            WITH combined_txs AS (
              -- Sender transactions
              SELECT 
                t.pk_transaction_id,
                t.transaction_id,
                t.block_timestamp,
                t.action_name,
                t.fee,
                t.request_data,
                'SENDER' as transaction_type,
                CAST(COALESCE(tt_sender.total_amount, NULL) AS TEXT) as fio_tokens
              FROM transactions t
              LEFT JOIN (
                SELECT 
                  fk_transaction_id, 
                  SUM(fio_suf_amount) as total_amount
                FROM tokentransfers 
                WHERE fk_payer_account_id = $1
                GROUP BY fk_transaction_id
              ) tt_sender ON t.pk_transaction_id = tt_sender.fk_transaction_id
              WHERE t.fk_account_id = $1
              
              UNION ALL
              
              -- Receiver transactions
              SELECT 
                t.pk_transaction_id,
                t.transaction_id,
                t.block_timestamp,
                t.action_name,
                t.fee,
                t.request_data,
                'RECEIVER' as transaction_type,
                CAST(COALESCE(tt_receiver.total_amount, NULL) AS TEXT) as fio_tokens
              FROM transactions t
              JOIN accountactivities aa ON t.pk_transaction_id = aa.fk_transaction_id
              LEFT JOIN (
                SELECT 
                  fk_transaction_id, 
                  SUM(fio_suf_amount) as total_amount
                FROM tokentransfers 
                WHERE fk_payee_account_id = $1
                GROUP BY fk_transaction_id
              ) tt_receiver ON t.pk_transaction_id = tt_receiver.fk_transaction_id
              WHERE aa.fk_account_id = $1
            )
            SELECT *
            FROM combined_txs
            ORDER BY pk_transaction_id DESC
            LIMIT $2 OFFSET $3
          `,
          values: [accountId, limit, offset],
        };
        
        // Get total counts more efficiently with materialized CTE
        const countQuery = {
          text: `
            WITH sender_count AS MATERIALIZED (
              SELECT COUNT(*) as count 
              FROM transactions 
              WHERE fk_account_id = $1
            ),
            receiver_count AS MATERIALIZED (
              SELECT COUNT(*) as count
              FROM accountactivities 
              WHERE fk_account_id = $1
            )
            SELECT 
              (SELECT count FROM sender_count) +
              (SELECT count FROM receiver_count) as total
          `,
          values: [accountId],
        };

        // Execute queries in parallel
        const [transactionsResult, countResult] = await Promise.all([
          pool.query(paginatedTransactionsQuery),
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
