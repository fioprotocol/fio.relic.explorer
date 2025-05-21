import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import {
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { DomainsResponse } from '@shared/types/domains';

interface DomainsQuery {
  Querystring: {
    offset?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sort?: 'pk_domain_id' | 'domain_name' | 'expiration_timestamp';
    only_public?: boolean;
  };
}

const blocksRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getDomainsOpts: RouteShorthandOptions = {
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
          order: { type: 'string', enum: ['asc', 'desc'] },
          sort: {
            type: 'string',
            default: 'pk_domain_id',
            enum: ['pk_domain_id', 'handle_count', 'expiration_timestamp'],
          },
          only_public: { type: 'boolean', default: false },
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
                  pk_domain_id: { type: 'number' },
                  domain_name: { type: 'string' },
                  is_public: { type: 'boolean' },
                  expiration_timestamp: { type: 'string' },
                  domain_status: { type: 'string' },
                  owner_account_name: { type: 'string' },
                  owner_account_id: { type: 'number' },
                  handle_count: { type: 'number' },
                },
              },
            },
            total: { type: 'number' },
            all: { type: 'number' },
            active: { type: 'number' },
          },
        },
      },
      tags: ['domain'],
      summary: 'Domains',
      description: 'Get domains',
    },
  };

  server.get<DomainsQuery>(
    '/',
    getDomainsOpts,
    async (
      request: FastifyRequest<DomainsQuery>,
      reply: FastifyReply
    ): Promise<DomainsResponse> => {
      const {
        offset = 0,
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        sort = 'pk_domain_id',
        only_public = false,
      } = request.query;

      let order = request.query.order;
      if (!order) {
        order = sort === 'expiration_timestamp' ? 'asc' : 'desc';
      }

      const sqlQuery = `
        SELECT
          d.pk_domain_id,
          d.domain_name,
          d.is_public,
          d.expiration_timestamp,
          d.domain_status,
          a.account_name as owner_account_name,
          a.pk_account_id as owner_account_id,
          (
            SELECT COUNT(*)
            FROM handles h
            WHERE h.fk_domain_id = d.pk_domain_id
          ) as handle_count
        FROM domains d
        LEFT JOIN accounts a ON d.fk_owner_account_id = a.pk_account_id
        WHERE d.domain_status = 'active'${only_public ? ' AND d.is_public = true' : ''}
        ORDER BY ${sort} ${order}
        LIMIT $1
        OFFSET $2
      `;

      // Query for total count
      const countQuery = {
        text: `
        SELECT COUNT(*) as total
        FROM domains
        WHERE domain_status = 'active'${only_public ? ' AND is_public = true' : ''}
      `,
        values: [],
      };
      const allQuery = {
        text: `
        SELECT COUNT(*) as total
        FROM domains
      `,
        values: [],
      };
      const activeQuery = {
        text: `
        SELECT COUNT(*) as total
        FROM domains
        WHERE domain_status = 'active'
      `,
        values: [],
      };

      const [handlesResult, countResult, allResult, activeResult] = await Promise.all([
        pool.query(sqlQuery, [limit, offset]),
        pool.query(countQuery),
        pool.query(allQuery),
        pool.query(activeQuery),
      ]);

      return {
        data: handlesResult.rows,
        total: parseInt(countResult.rows[0].total),
        all: parseInt(allResult.rows[0].total),
        active: parseInt(activeResult.rows[0].total),
      };
    }
  );
};

export default blocksRoute;
