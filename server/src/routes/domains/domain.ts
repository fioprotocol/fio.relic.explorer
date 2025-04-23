import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';
import { setTableRowsParams, getTableRows } from 'src/services/external/fio';

import { validateDomainRegex } from '@shared/util/fio';

import { DomainResponse } from '@shared/types/domains';

interface domainQuery {
  Params: {
    domain: string;
  };
}

const domainRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getDomainsOpts: RouteShorthandOptions = {
    schema: {
      params: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            pattern: validateDomainRegex,
          },
        },
        required: ['domain'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            domain: {
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
            chainData: {
              type: 'object',
              properties: {
                owner_account: { type: 'string' },
              },
            },
          },
        },
      },
      tags: ['Domains'],
      summary: 'Domain',
      description: 'Get domain details',
    },
  };

  server.get<domainQuery>(
    '/',
    getDomainsOpts,
    async (request: FastifyRequest<domainQuery>, reply: FastifyReply): Promise<DomainResponse> => {
      const { domain } = request.params;

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
        WHERE
          d.domain_name = $1
      `;

      const domainResult = await pool.query(sqlQuery, [domain]);

      if (domainResult.rows.length === 0) {
        return reply.status(404).send({ error: 'Handle not found' });
      }

      const chainData = await getTableRows(setTableRowsParams(domain));

      return {
        domain: { ...domainResult.rows[0] },
        chainData: chainData.rows[0],
      };
    }
  );
};

export default domainRoute;
