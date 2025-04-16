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
          id: { type: 'string' }
        }
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
                      request_data: { type: 'string' }
                    }
                  } 
                }
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

  server.get('/', getTransactionByIdOpts, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const query = {
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
          a.account_name,
          ac.account_name as contract_action_name,
          (SELECT COALESCE(json_agg(json_build_object(
            'account_name', acc.account_name,
            'action_name', tr.action_name,
            'request_data', tr.request_data
          )), '[]'::json) 
           FROM traces tr 
           LEFT JOIN accounts acc ON tr.fk_action_account_id = acc.pk_account_id
           WHERE t.pk_transaction_id = tr.fk_transaction_id) as traces
        FROM transactions t
        LEFT JOIN accounts a ON t.fk_account_id = a.pk_account_id
        LEFT JOIN accounts ac ON t.fk_action_account_id = ac.pk_account_id
        WHERE t.transaction_id = $1
      `,
      values: [id]
    };
    
    const result = await pool.query(query);
    
    if (result.rows.length === 0) {
      reply.code(404);
      return { error: 'Transaction not found' };
    }

    return { data: result.rows[0] as TransactionDetails };
  });
};

export default getTransactionByIdRoute;
