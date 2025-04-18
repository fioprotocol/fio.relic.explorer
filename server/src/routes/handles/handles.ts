import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import {
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { HandlesResponse } from '@shared/types/handles';

interface HandlesQuery {
  Querystring: {
    offset?: number;
    limit?: number;
  };
}

const blocksRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Health check endpoint
  const getHandlesOpts: RouteShorthandOptions = {
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
                  pk_handle_id: { type: 'number' },
                  handle: { type: 'string' },
                  encryption_key: { type: 'string' },
                  is_encrypt_key_set: { type: 'boolean' },
                  bundled_tx_count: { type: 'number' },
                  expiration_stamp: { type: 'string' },
                  handle_status: { type: 'string' },
                  owner_account_name: { type: 'string' },
                  owner_account_id: { type: 'string' },
                  domain_name: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
            all: { type: 'number' },
            active: { type: 'number' },
          },
        },
      },
      tags: ['handle'],
      summary: 'Handles',
      description: 'Get handles',
    },
  };

  server.get<HandlesQuery>(
    '/',
    getHandlesOpts,
    async (
      request: FastifyRequest<HandlesQuery>,
      reply: FastifyReply
    ): Promise<HandlesResponse> => {
      const { offset = 0, limit = DEFAULT_REQUEST_ITEMS_LIMIT } = request.query;

      const sqlQuery = `
        SELECT
          h.pk_handle_id,
          h.handle,
          h.encryption_key,
          h.is_encrypt_key_set,
          h.expiration_stamp,
          h.handle_status,
          a.account_name as owner_account_name,
          a.pk_account_id as owner_account_id,
          d.domain_name
        FROM
          handles h
          LEFT JOIN accounts a ON h.fk_owner_account_id = a.pk_account_id
          LEFT JOIN domains d ON h.fk_domain_id = d.pk_domain_id
        ORDER BY h.pk_handle_id DESC
        LIMIT $1
        OFFSET $2
      `;

      // Query for total count
      const countQuery = {
        text: `
        SELECT COUNT(*) as total
        FROM handles
      `,
        values: [],
      };
      const activeQuery = {
        text: `
        SELECT COUNT(*) as total
        FROM handles
        WHERE handle_status = 'active'
      `,
        values: [],
      };

      const [handlesResult, countResult, activeResult] = await Promise.all([
        pool.query(sqlQuery, [limit, offset]),
        pool.query(countQuery),
        pool.query(activeQuery),
      ]);

      return {
        data: handlesResult.rows,
        total: parseInt(countResult.rows[0].total),
        all: parseInt(countResult.rows[0].total),
        active: parseInt(activeResult.rows[0].total),
      };
    }
  );
};

export default blocksRoute;
