import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import { CursorPagination } from 'src/utils/cursorPagination';

import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';

import { validateDomainRegex } from '@shared/util/fio';

import { DomainTransaction } from '@shared/types/domains';
import { CursorResponse } from '@shared/types/general';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';

interface DomainTransactionsQuery {
  Params: {
    domain: string;
  };
  Querystring: {
    limit?: number;
    cursor?: string;
    direction?: PaginationDirection;
    include_total?: boolean;
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
          cursor: { type: 'string' },
          direction: {
            type: 'string',
            enum: [PAGINATION_DIRECTIONS.NEXT, PAGINATION_DIRECTIONS.PREV],
            default: PAGINATION_DIRECTIONS.NEXT,
          },
          limit: {
            type: 'integer',
            default: DEFAULT_REQUEST_ITEMS_LIMIT,
            minimum: 1,
            maximum: DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
          },
          include_total: { type: 'boolean', default: false },
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
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
            nextCursor: { type: ['string', 'null'] },
            prevCursor: { type: ['string', 'null'] },
            total: { type: 'number' },
          },
          required: ['data', 'hasNextPage', 'hasPrevPage', 'nextCursor', 'prevCursor'],
        },
      },
      tags: ['Domains'],
      summary: 'Domain Transactions',
      description: 'Get domain transactions',
    },
  };

  server.get<DomainTransactionsQuery>(
    '/',
    getTransactionsOpts,
    async (request: FastifyRequest<DomainTransactionsQuery>, reply: FastifyReply) => {
      const {
        cursor,
        direction = PAGINATION_DIRECTIONS.NEXT,
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        include_total = false,
      } = request.query;

      const { domain } = request.params;

      try {
        const selectColumns = `
          da.pk_domain_activity_id,
          da.domain_activity_type,
          da.block_timestamp,
          t.transaction_id,
          t.action_name,
          t.tpid,
          t.fee,
          t.result_status,
          a.account_name
        `;

        const joinClause = `
          JOIN domains d ON da.fk_domain_id = d.pk_domain_id
          JOIN transactions t ON da.fk_transaction_id = t.pk_transaction_id
          LEFT JOIN accounts a ON t.fk_account_id = a.pk_account_id
        `;

        const whereClause = 'd.domain_name = $1';
        const whereValues = [domain];

        const result = await CursorPagination.paginate<DomainTransaction>({
          table: 'domainactivities da',
          cursorColumn: 'da.pk_domain_activity_id',
          orderDirection: 'DESC',
          limit,
          cursor,
          direction,
          whereClause,
          whereValues,
          selectColumns,
          joinClause,
        });

        let total: number | undefined;
        if (include_total) {
          total = await CursorPagination.getTotalCount({
            table: 'domainactivities da',
            joinClause,
            whereClause,
            whereValues,
          });
        }

        const response: CursorResponse<{ data: DomainTransaction[] }> = {
          data: result.data,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          nextCursor: result.nextCursor,
          prevCursor: result.prevCursor,
          ...(total !== undefined && { total }),
        };

        return reply.send(response);
      } catch (error) {
        fastify.log.error('Error fetching domain transactions with cursor pagination:', error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
};

export default domainTransactionsRoute;
