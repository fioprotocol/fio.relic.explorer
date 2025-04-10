import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from '../../config/database';
import { Transaction } from '@shared/types/transactions';

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
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            transaction: {
              type: 'object',
              properties: {
                pk_transaction_id: { type: 'string' },
                fk_block_number: { type: 'number' },
                block_timestamp: { type: 'string' },
                transaction_id: { type: 'string' },
                fk_action_account_id: { type: 'string' },
                fk_account_id: { type: 'string' },
                account_name: { type: 'string' },
                action_name: { type: 'string' },
                tpid: { type: 'string' },
                fee: { type: 'number' },
                request_data: { type: 'string' },
                response_data: { type: 'string' },
                result_status: { type: 'string' }
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
      tags: ['transactions'],
      summary: 'Get transaction by ID',
      description: 'Get a specific transaction by its ID',
    },
  };

  server.get('/:id', getTransactionByIdOpts, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    
    const query = {
      text: `
        SELECT 
          t.pk_transaction_id, 
          t.fk_block_number, 
          t.block_timestamp, 
          t.transaction_id, 
          t.fk_action_account_id, 
          t.fk_account_id, 
          a.account_name, 
          t.action_name, 
          t.tpid, 
          t.fee, 
          t.request_data, 
          t.response_data, 
          t.result_status
        FROM transactions t
        LEFT JOIN accounts a ON t.fk_account_id = a.pk_account_id
        WHERE t.transaction_id = $1
      `,
      values: [id]
    };
    
    const result = await pool.query(query);
    
    if (result.rows.length === 0) {
      reply.code(404);
      return { error: 'Transaction not found' };
    }
    
    return { transaction: result.rows[0] as Transaction };
  });
};

export default getTransactionByIdRoute;
