import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from '../../config/database';
import { TransactionDetails } from '@shared/types/transactions';

const getTransactionByIdRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Get transaction by ID endpoint
  const getTransactionByIdOpts: RouteShorthandOptions = {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                block_number: { type: 'number' },
                block_timestamp: { type: 'string' },
                transaction_id: { type: 'string' },
                account_name: { type: 'string' },
                action_name: { type: 'string' },
                tpid: { type: 'string' },
                fee: { type: 'number' },
                request_data: { type: 'string' },
                response_data: { type: 'string' },
                result_status: { type: 'string' },
                contract_action_name: { type: 'string' },
                traces: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      account_name: { type: 'string' },
                      action_name: { type: 'string' },
                      request_data: { type: 'string' },
                    },
                  },
                },
                token_transfers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      payer_account_name: { type: 'string' },
                      payer_public_key: { type: 'string' },
                      payee_account_name: { type: 'string' },
                      payee_public_key: { type: 'string' },
                      amount: { type: 'string' },
                      memo: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
      tags: ['transactions'],
      summary: 'Get transaction by ID',
      description: 'Get a specific transaction by its ID',
    },
  };

  server.get('/', getTransactionByIdOpts, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    try {
      // First query: Get the basic transaction data
      const transactionQuery = {
        text: `
          SELECT
            t.transaction_id,
            t.block_timestamp,
            t.result_status,
            t.action_name,
            t.tpid,
            t.fee,
            t.request_data,
            t.response_data,
            t.fk_block_number as block_number,
            t.pk_transaction_id,
            a.account_name,
            ac.account_name as contract_action_name
          FROM transactions t
          LEFT JOIN accounts a ON t.fk_account_id = a.pk_account_id
          LEFT JOIN accounts ac ON t.fk_action_account_id = ac.pk_account_id
          WHERE t.transaction_id = $1
          LIMIT 1
        `,
        values: [id],
      };

      const transactionResult = await pool.query(transactionQuery);

      if (transactionResult.rows.length === 0) {
        reply.code(404);
        return { message: 'Transaction not found' };
      }

      const transaction = transactionResult.rows[0];
      const txId = transaction.pk_transaction_id;

      // Run traces and token transfers queries in parallel for better performance
      const [tracesResult, tokenTransfersResult] = await Promise.all([
        // Traces query
        pool.query({
          text: `
            SELECT 
              acc.account_name,
              tr.action_name,
              tr.request_data
            FROM traces tr 
            LEFT JOIN accounts acc ON tr.fk_action_account_id = acc.pk_account_id
            WHERE tr.fk_transaction_id = $1
          `,
          values: [txId],
        }),
        // Token transfers query
        pool.query({
          text: `
            SELECT 
              payer.account_name AS payer_account_name,
              payer.public_key AS payer_public_key,
              payee.account_name AS payee_account_name,
              payee.public_key AS payee_public_key,
              tt.fio_suf_amount AS amount,
              tt.transfer_memo AS memo
            FROM tokentransfers tt
            LEFT JOIN accounts payer ON tt.fk_payer_account_id = payer.pk_account_id
            LEFT JOIN accounts payee ON tt.fk_payee_account_id = payee.pk_account_id
            WHERE tt.fk_transaction_id = $1
            ORDER BY tt.pk_token_transfers_id
          `,
          values: [txId],
        }),
      ]);

      // Format the response
      const response = {
        ...transaction,
        traces: tracesResult.rows,
        token_transfers: tokenTransfersResult.rows,
      };

      // Remove pk_transaction_id as it's not part of the response schema
      delete response.pk_transaction_id;

      return { data: response as TransactionDetails };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      reply.code(500);
      return { message: 'Internal server error' };
    }
  });
};

export default getTransactionByIdRoute;
