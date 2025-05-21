import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import { BlockResponse } from '@shared/types/blocks';

interface BlockQuery {
  Params: {
    block_number: number;
  };
}

const blockRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Health check endpoint
  const getBlocksOpts: RouteShorthandOptions = {
    schema: {
      params: {
        type: 'object',
        properties: {
          block_number: { type: 'number' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                block: {
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
                previous_block_number: { type: 'number' },
                next_block_number: { type: 'number' },
              },
            },
          },
        },
      },
      tags: ['blocks'],
      summary: 'Block',
      description: 'Get block details',
    },
  };

  server.get<BlockQuery>(
    '/',
    getBlocksOpts,
    async (request: FastifyRequest<BlockQuery>, reply: FastifyReply): Promise<BlockResponse> => {
      const { block_number } = request.params;

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
            ) as transaction_count
          FROM
            blocks b
          WHERE
            b.pk_block_number = $1
      `;
      const result = await pool.query(sqlQuery, [block_number]);

      if (result.rowCount === 0) {
        // Using return reply.code()... sends the response and stops execution
        return reply.code(404).send({ message: 'Block not found' });
      }

      const neighborsSqlQuery = `
        SELECT * FROM (
          (SELECT pk_block_number, 'prev' AS type FROM blocks WHERE pk_block_number < $1 ORDER BY pk_block_number DESC LIMIT 1)
          UNION ALL
          (SELECT pk_block_number, 'next' AS type FROM blocks WHERE pk_block_number > $1 ORDER BY pk_block_number ASC LIMIT 1)
        ) adjacent_blocks
      `;
      const neighborsResult = await pool.query(neighborsSqlQuery, [block_number]);

      let previous_block_number: number | null = null;
      let next_block_number: number | null = null;

      neighborsResult.rows.forEach((row: { pk_block_number: number; type: 'prev' | 'next' }) => {
        if (row.type === 'prev') {
          previous_block_number = row.pk_block_number;
        } else if (row.type === 'next') {
          next_block_number = row.pk_block_number;
        }
      });

      return {
        data: {
          block: result.rows[0],
          previous_block_number: previous_block_number,
          next_block_number: next_block_number,
        },
      };
    }
  );
};

export default blockRoute;
