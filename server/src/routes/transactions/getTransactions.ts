import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from '../../config/database';
import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_OFFSET,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { TransactionResponse, Transaction } from '@shared/types/transactions';

const getTransactionsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Get transactions endpoint
  const getTransactionsOpts: RouteShorthandOptions = {
    schema: {
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
          block_number: { type: 'integer' },
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
                  result_status: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
            offset: { type: 'number' },
            limit: { type: 'number' },
          },
        },
      },
      tags: ['transactions'],
      summary: 'Get transactions with offset and limit',
      description: 'Get transactions with offset and limit',
    },
  };

  server.get('/', getTransactionsOpts, async (request: FastifyRequest, reply: FastifyReply) => {
    const {
      offset = DEFAULT_REQUEST_ITEMS_OFFSET,
      limit = DEFAULT_REQUEST_ITEMS_LIMIT,
      block_number,
    } = request.query as {
      offset?: number;
      limit?: number;
      block_number?: number;
    };

    // Query for transactions
    const transactionsQuery = {
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
        ${block_number ? `WHERE t.fk_block_number = $3` : ''}
        ORDER BY t.block_timestamp DESC
        LIMIT $1 OFFSET $2
      `,
      values: block_number ? [limit, offset, block_number] : [limit, offset],
    };

    // Query for total count
    const countQuery = {
      text: `
        SELECT COUNT(pk_transaction_id) as total
        FROM transactions
        ${block_number ? `WHERE fk_block_number = $1` : ''}
      `,
      values: block_number ? [block_number] : [],
    };

    // Execute both queries
    const [transactionsResult, countResult] = await Promise.all([
      pool.query(transactionsQuery),
      pool.query(countQuery),
    ]);

    const transactions = transactionsResult.rows as Transaction[];
    const total = parseInt(countResult.rows[0].total);

    const response: TransactionResponse = {
      transactions,
      total,
    };

    return response;
  });
};

export default getTransactionsRoute;
