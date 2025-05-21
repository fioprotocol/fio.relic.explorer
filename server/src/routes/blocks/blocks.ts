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
            current_block: {
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

      // pagination here implemented by pk_block_number calculations assuming that
      // pk_block_number is increamenting by 1 from 1 to MAX(pk_block_number) and there would be no deletions.
      // COUNT(*) executes too long when we have such amount of data (hundreds of millions)
      // todo: check if there could be missing records and if they could be deleted. 
      // if so we need to create one more table to store count and update it using triggers.
      const sqlQuery = `
        SELECT
          b.pk_block_number,
          b.stamp,
          b.block_id,
          b.producer_account_name,
          b.schedule_version,
          (
            SELECT COUNT(*)
            FROM transactions t
            WHERE t.fk_block_number = b.pk_block_number
          ) as transactions_count
        FROM
          blocks b
        WHERE
          b.pk_block_number <= (SELECT MAX(pk_block_number) - $2 FROM blocks)
        GROUP BY
          b.pk_block_number,
          b.stamp,
          b.block_id,
          b.producer_account_name,
          b.schedule_version
        ORDER BY
          b.pk_block_number DESC
        LIMIT $1
      `;

       const countQuery = {
        text: `
        SELECT MAX(pk_block_number) as total
        FROM blocks
      `,
        values: [],
      };

      // Query for total count
      const currentBlockQuery = {
        text: `
        SELECT
          b.pk_block_number,
          b.stamp,
          b.block_id,
          b.producer_account_name,
          b.schedule_version,
          (
            SELECT COUNT(*)
            FROM transactions t
            WHERE t.fk_block_number = b.pk_block_number
          ) as transaction_count
        FROM
          blocks b
        ORDER BY
          b.pk_block_number DESC
        LIMIT 1
      `,
        values: [],
      };

      const [countResult, result, currentBlockResult] = await Promise.all([
        pool.query(countQuery),
        pool.query(sqlQuery, [limit, offset]),
        offset === 0 ? Promise.resolve({ rows: [] }) : pool.query(currentBlockQuery),
      ]);

      const total = parseInt(countResult.rows[0].total);

      return {
        data: result.rows,
        current_block: offset === 0 ? result.rows[0] : currentBlockResult.rows[0],
        total,
      };
    }
  );
};

export default blocksRoute;
