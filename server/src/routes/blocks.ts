import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

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
    async (request: FastifyRequest<BlocksQuery>, reply: FastifyReply) => {
      const { offset = 0, limit = 25 } = request.query;

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
        ORDER BY
          b.pk_block_number DESC
          LIMIT $1
          OFFSET $2
      `;
      const result = await pool.query(sqlQuery, [limit, offset]);

      return {
        data: result.rows[0],
      };
    }
  );
};

export default blocksRoute;
