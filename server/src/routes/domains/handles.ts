import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import {
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';

import { validateDomainRegex } from '@shared/util/fio';

import { CursorHandlesResponse } from '@shared/types/handles';
import { Handle } from '@shared/types/handles';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';
import { CursorPagination } from 'src/utils/cursorPagination';

interface DomainHandlesQuery {
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

const handlesRoute: FastifyPluginAsync = async (fastify) => {
  const server = fastify.withTypeProvider();

  const getHandlesOpts: RouteShorthandOptions = {
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
                  pk_handle_id: { type: 'number' },
                  handle: { type: 'string' },
                  handle_status: { type: 'string' },
                  owner_account_name: { type: 'string' },
                  domain_name: { type: 'string' },
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
      tags: ['Handles'],
      summary: 'Domain handles with cursor pagination',
      description: 'Get handles registered under a domain using cursor-based pagination',
    },
  };

  server.get<DomainHandlesQuery>(
    '/',
    getHandlesOpts,
    async (request: FastifyRequest<DomainHandlesQuery>, reply: FastifyReply) => {
      const {
        cursor,
        direction = PAGINATION_DIRECTIONS.NEXT,
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        include_total = false,
      } = request.query;

      const { domain } = request.params;

      try {
        const selectColumns = `
          h.pk_handle_id,
          h.handle,
          h.handle_status,
          a.account_name as owner_account_name,
          d.domain_name
        `;

        const joinClause = `
          JOIN domains d ON h.fk_domain_id = d.pk_domain_id
          LEFT JOIN accounts a ON h.fk_owner_account_id = a.pk_account_id
        `;

        const whereClause = 'd.domain_name = $1';
        const whereValues = [domain];

        const result = await CursorPagination.paginate<Handle>({
          table: 'handles h',
          cursorColumn: 'h.pk_handle_id',
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
            table: 'handles h',
            joinClause,
            whereClause,
            whereValues,
          });
        }

        const response: CursorHandlesResponse = {
          data: result.data,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          nextCursor: result.nextCursor,
          prevCursor: result.prevCursor,
          ...(total !== undefined && { total }),
        };

        return reply.send(response);
      } catch (error) {
        fastify.log.error('Error fetching domain handles with cursor pagination:', error);
        return reply.code(500).send({ message: 'Internal server error' });
      }
    }
  );
};

export default handlesRoute;
