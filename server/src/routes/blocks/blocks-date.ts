import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import { BlocksDateResponse } from '@shared/types/blocks';

interface BlocksDateQuery {
  Querystring: {
    ['blocks[]']: string[];
  };
}

const MAX_BLOCKS = 100;

const blocksRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getBlocksOpts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          ['blocks[]']: { type: 'array', items: { type: 'string' }, maxItems: MAX_BLOCKS },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              additionalProperties: { type: 'number' },
            },
          },
        },
      },
      tags: ['block'],
      summary: 'Blocks Date',
      description: 'Get blocks date',
    },
  };

  server.get<BlocksDateQuery>(
    '/',
    getBlocksOpts,
    async (request: FastifyRequest<BlocksDateQuery>): Promise<BlocksDateResponse> => {
      const { 'blocks[]': blocks } = request.query;

      const sqlQuery = `
        SELECT
          b.pk_block_number,
          b.stamp
        FROM
          blocks b
        WHERE
          b.pk_block_number IN (${blocks.map((_, index) => `$${index + 1}`).join(',')})
      `;

      const result = await pool.query(sqlQuery, blocks);

      const data: Record<string, number> = result.rows.reduce(
        (acc, block) => {
          acc[block.pk_block_number] = block.stamp;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        data,
      };
    }
  );
};

export default blocksRoute;
