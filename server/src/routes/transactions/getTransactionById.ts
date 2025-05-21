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
              },
            },
          },
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
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
        return { error: 'Transaction not found' };
      }

      const transaction = transactionResult.rows[0];

      // Second query: Get the traces data separately
      const tracesQuery = {
        text: `
          SELECT 
            acc.account_name,
            tr.action_name,
            tr.request_data
          FROM traces tr 
          LEFT JOIN accounts acc ON tr.fk_action_account_id = acc.pk_account_id
          WHERE tr.fk_transaction_id = $1
        `,
        values: [transaction.pk_transaction_id],
      };

      const tracesResult = await pool.query(tracesQuery);

      // Format the response
      const response = {
        ...transaction,
        traces: tracesResult.rows,
      };

      // Remove pk_transaction_id as it's not part of the response schema
      delete response.pk_transaction_id;

      return { data: response as TransactionDetails };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      reply.code(500);
      return { error: 'Internal server error' };
    }
  });
};

export default getTransactionByIdRoute;
