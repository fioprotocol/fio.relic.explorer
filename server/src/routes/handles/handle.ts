import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';
import { setTableRowsParams, getTableRows } from 'src/services/external/fio';

import { validateHandleRegex } from '@shared/util/fio';

import { HandleResponse } from '@shared/types/handles';

interface handleQuery {
  Params: {
    handle: string;
  };
}

const handleRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Health check endpoint
  const getHandlesOpts: RouteShorthandOptions = {
    schema: {
      params: {
        type: 'object',
        properties: {
          handle: {
            type: 'string',
          },
        },
        required: ['handle'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            handle: {
              type: 'object',
              properties: {
                pk_handle_id: { type: 'number' },
                handle: { type: 'string' },
                encryption_key: { type: 'string' },
                is_encrypt_key_set: { type: 'boolean' },
                bundled_tx_count: { type: 'number' },
                expiration_stamp: { type: 'string' },
                block_timestamp: { type: 'string' },
                handle_status: { type: 'string' },
                owner_account_name: { type: 'string' },
                owner_account_id: { type: 'number' },
                domain_name: { type: 'string' },
                pk_domain_id: { type: 'number' },
              },
            },
            chainData: {
              type: 'object',
              properties: {
                owner_account: { type: 'string' },
                bundleeligiblecountdown: { type: 'number' },
                addresses: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      token_code: { type: 'string' },
                      chain_code: { type: 'string' },
                      public_address: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      tags: ['Handles'],
      summary: 'Handle',
      description: 'Get handle details',
    },
  };

  server.get<handleQuery>(
    '/',
    getHandlesOpts,
    async (request: FastifyRequest<handleQuery>, reply: FastifyReply): Promise<HandleResponse> => {
      const { handle } = request.params;

      if (!new RegExp(validateHandleRegex, 'gim').test(handle)) {
        return reply.status(400).send({ error: 'Invalid handle' });
      }

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
          d.domain_name,
          d.pk_domain_id
        FROM
          handles h
          LEFT JOIN accounts a ON h.fk_owner_account_id = a.pk_account_id
          LEFT JOIN domains d ON h.fk_domain_id = d.pk_domain_id
        WHERE
          h.handle = $1
      `;

      const handleResult = await pool.query(sqlQuery, [handle]);

      const activitiesQuery = `
        SELECT
          ha.block_timestamp
        FROM
          handleactivities ha
        WHERE
          ha.fk_handle_id = $1
        ORDER BY
          ha.pk_handle_activity_id ASC
        LIMIT 1
      `;

      if (handleResult.rows.length === 0) {
        return reply.status(404).send({ error: 'Handle not found' });
      }

      const activitiesResult = await pool.query(activitiesQuery, [
        handleResult.rows[0].pk_handle_id,
      ]);

      const chainData = await getTableRows(setTableRowsParams(handle));

      return {
        handle: { ...handleResult.rows[0], ...activitiesResult.rows[0] },
        chainData: chainData.rows[0],
      };
    }
  );
};

export default handleRoute;
