import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_OFFSET,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';

import { HandleTransactionsResponse } from '@shared/types/handles';

interface handleQuery {
  Params: {
    handle: string;
  };
  Querystring: {
    limit: number;
    offset: number;
  };
}

const handleTransactionsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Health check endpoint
  const getTransactionsOpts: RouteShorthandOptions = {
    schema: {
      params: {
        type: 'object',
        properties: {
          handle: { type: 'string' },
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
                  pk_handle_activity_id: { type: 'number' },
                  handle_activity_type: { type: 'string' },
                  block_timestamp: { type: 'string' },
                  transaction_id: { type: 'string' },
                  action_name: { type: 'string' },
                  tpid: { type: 'string' },
                  fee: { type: 'string' },
                  result_status: { type: 'string' },
                  account_name: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
          },
        },
      },
      tags: ['Handles'],
      summary: 'Handle Transactions',
      description: 'Get handle transactions',
    },
  };

  server.get<handleQuery>(
    '/',
    getTransactionsOpts,
    async (
      request: FastifyRequest<handleQuery>,
      reply: FastifyReply
    ): Promise<HandleTransactionsResponse> => {
      const { handle } = request.params;
      const { limit, offset } = request.query;

      const transactionsQuery = {
        text: `
          SELECT
            ha.pk_handle_activity_id,
            ha.handle_activity_type,
            ha.block_timestamp,
            t.transaction_id,
            t.action_name,
            t.tpid,
            t.fee,
            t.result_status,
            a.account_name
          FROM
            handleactivities ha
            LEFT JOIN handles h ON ha.fk_handle_id = h.pk_handle_id
            JOIN transactions t ON ha.fk_transaction_id = t.pk_transaction_id
            LEFT JOIN accounts a ON t.fk_account_id = a.pk_account_id
          WHERE
            h.handle = $1
          ORDER BY
            ha.block_timestamp DESC
          LIMIT $2
          OFFSET $3
      `,
        values: [handle, limit, offset],
      };

      const countQuery = {
        text: `
          SELECT
            COUNT(*) as total
          FROM
            handleactivities ha
            LEFT JOIN handles h ON ha.fk_handle_id = h.pk_handle_id
            JOIN transactions t ON ha.fk_transaction_id = t.pk_transaction_id
          WHERE
            h.handle = $1
      `,
        values: [handle],
      };

      const [transactionsResult, countResult] = await Promise.all([
        pool.query(transactionsQuery),
        pool.query(countQuery),
      ]);

      return {
        transactions: transactionsResult.rows,
        total: parseInt(countResult.rows[0].total),
      };
    }
  );
};

export default handleTransactionsRoute;
