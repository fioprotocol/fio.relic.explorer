import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_OFFSET,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';

import { validateDomainRegex } from '@shared/util/fio';

import { DomainTransactionsResponse } from '@shared/types/domains';

interface domainTransactionsQuery {
  Params: {
    domain: string;
  };
  Querystring: {
    limit: number;
    offset: number;
  };
}

const domainTransactionsRoute: FastifyPluginAsync = async (fastify) => {
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
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pk_domain_activity_id: { type: 'number' },
                  domain_activity_type: { type: 'string' },
                  block_timestamp: { type: 'string' },
                  transaction_id: { type: 'string' },
                  action_name: { type: 'string' },
                  tpid: { type: 'string' },
                  fee: { type: 'string' },
                  result_status: { type: 'string' },
                  account_name: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
          },
        },
      },
      tags: ['Domains'],
      summary: 'Domain Transactions',
      description: 'Get domain transactions',
    },
  };

  server.get<domainTransactionsQuery>(
    '/',
    getTransactionsOpts,
    async (
      request: FastifyRequest<domainTransactionsQuery>,
      reply: FastifyReply
    ): Promise<DomainTransactionsResponse> => {
      const { domain } = request.params;
      const { limit, offset } = request.query;

      const transactionsQuery = {
        text: `
          SELECT
            da.pk_domain_activity_id,
            da.domain_activity_type,
            da.block_timestamp,
            t.transaction_id,
            t.action_name,
            t.tpid,
            t.fee,
            t.result_status,
            a.account_name
          FROM
            domainactivities da
            JOIN domains d ON da.fk_domain_id = d.pk_domain_id
            JOIN transactions t ON da.fk_transaction_id = t.pk_transaction_id
            LEFT JOIN accounts a ON t.fk_account_id = a.pk_account_id
          WHERE
            d.domain_name = $1
          ORDER BY
            da.pk_domain_activity_id ASC
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
            domainactivities da
            JOIN domains d ON da.fk_domain_id = d.pk_domain_id
            JOIN transactions t ON da.fk_transaction_id = t.pk_transaction_id
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
        transactions: transactionsResult.rows,
        total: parseInt(countResult.rows[0].total),
      };
    }
  );
};

export default domainTransactionsRoute;
