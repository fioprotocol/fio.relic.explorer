import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import { CurrentBlockResponse } from '@shared/types/blocks';

import pool from 'src/config/database';

const currentBlockRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Health check endpoint
  const getCurrentBlockOpts: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                pk_block_number: { type: 'number' },
                block_id: { type: 'string' },
                producer_account_name: { type: 'string' },
                stamp: { type: 'string' },
                transaction_count: { type: 'number' },
              },
            },
          },
        },
      },
      tags: ['block'],
      summary: 'Current Block',
      description: 'Get the current block info',
    },
  };

  server.get(
    '/',
    getCurrentBlockOpts,
    async (request: FastifyRequest, reply: FastifyReply): Promise<CurrentBlockResponse> => {
      const sqlQuery = `SELECT *, (
      SELECT COUNT(*)
      FROM transactions t
      WHERE t.fk_block_number = b.pk_block_number
    ) as transaction_count FROM blocks b ORDER BY pk_block_number DESC LIMIT 1`;
      const result = await pool.query(sqlQuery);

      return {
        data: result.rows[0],
      };
    }
  );
};

export default currentBlockRoute;
