import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import {
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { BlocksResponse } from '@shared/types/blocks';

interface BlocksQuery {
  Querystring: {
    offset?: number;
    limit?: number;
  };
}

const blocksRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Health check endpoint
  const getBlocksOpts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          offset: { type: 'number', default: 0 },
          limit: {
            type: 'number',
            default: DEFAULT_REQUEST_ITEMS_LIMIT,
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
                  pk_block_number: { type: 'number' },
                  stamp: { type: 'string' },
                  block_id: { type: 'string' },
                  producer_account_name: { type: 'string' },
                  schedule_version: { type: 'number' },
                  transaction_count: { type: 'number' },
                },
              },
            },
            total: { type: 'number' },
          },
        },
      },
      tags: ['block'],
      summary: 'Blocks',
      description: 'Get blocks',
    },
  };

  server.get<BlocksQuery>(
    '/',
    getBlocksOpts,
    async (request: FastifyRequest<BlocksQuery>, reply: FastifyReply): Promise<BlocksResponse> => {
      const { offset = 0, limit = DEFAULT_REQUEST_ITEMS_LIMIT } = request.query;

      const sqlQuery = `
        SELECT
          b.pk_block_number,
          b.stamp,
          b.block_id,
          b.producer_account_name,
          b.schedule_version,
          COUNT(t.transaction_id) as transaction_count
        FROM
          blocks b
          LEFT JOIN transactions t ON t.fk_block_number = b.pk_block_number
        GROUP BY
          b.pk_block_number,
          b.stamp,
          b.block_id,
          b.producer_account_name,
          b.schedule_version
        ORDER BY
          b.pk_block_number DESC
        LIMIT $1
        OFFSET $2
      `;

      // Query for total count
      const countQuery = {
        text: `
        SELECT COUNT(*) as total
        FROM blocks
      `,
        values: []
      };

      const [result, countResult] = await Promise.all([
        pool.query(sqlQuery, [limit, offset]),
        pool.query(countQuery)
      ]);

      const total = parseInt(countResult.rows[0].total);

      return {
        data: result.rows,
        total,
      };
    }
  );
};

export default blocksRoute;
