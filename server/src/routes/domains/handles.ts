import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_OFFSET,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';

import { validateDomainRegex } from '@shared/util/fio';

import { DomainHandlesResponse } from '@shared/types/domains';

interface domainHandlesQuery {
  Params: {
    domain: string;
  };
  Querystring: {
    limit: number;
    offset: number;
  };
}

const handlesRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getTransactionsOpts: RouteShorthandOptions = {
    schema: {
      params: {
        type: 'object',
        properties: {
          domain: { type: 'string', pattern: validateDomainRegex },
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
            handles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pk_handle_id: { type: 'number' },
                  handle: { type: 'string' },
                  handle_status: { type: 'string' },
                  owner_account_name: { type: 'string' },
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

  server.get<domainHandlesQuery>(
    '/',
    getTransactionsOpts,
    async (
      request: FastifyRequest<domainHandlesQuery>,
      reply: FastifyReply
    ): Promise<DomainHandlesResponse> => {
      const { domain } = request.params;
      const { limit, offset } = request.query;

      const transactionsQuery = {
        text: `
          SELECT
          h.pk_handle_id,
          h.handle,
          h.handle_status,
          a.account_name as owner_account_name,
          d.domain_name
          FROM
            handles h
            JOIN domains d ON h.fk_domain_id = d.pk_domain_id
            LEFT JOIN accounts a ON h.fk_owner_account_id = a.pk_account_id
          WHERE
            d.domain_name = $1
          ORDER BY h.pk_handle_id DESC
          LIMIT $2
          OFFSET $3
      `,
        values: [domain, limit, offset],
      };

      const countQuery = {
        text: `
          SELECT
            COUNT(*) as total
          FROM
            handles h
            JOIN domains d ON h.fk_domain_id = d.pk_domain_id
          WHERE
            d.domain_name = $1
      `,
        values: [domain],
      };

      const [transactionsResult, countResult] = await Promise.all([
        pool.query(transactionsQuery),
        pool.query(countQuery),
      ]);

      return {
        handles: transactionsResult.rows,
        total: parseInt(countResult.rows[0].total),
      };
    }
  );
};

export default handlesRoute;
