import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import { CursorPagination } from 'src/utils/cursorPagination';

import {
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { CursorDomainsResponse, Domain, DomainSortOption } from '@shared/types/domains';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';

interface DomainsQuery {
  Querystring: {
    offset?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sort?: DomainSortOption;
    only_public?: boolean;
    cursor?: string;
    direction?: PaginationDirection;
    include_total?: boolean;
  };
}

const getSortField = (sort: string) => {
  // Defensive: only allow known fields
  if (['pk_domain_id', 'domain_name', 'expiration_timestamp', 'handle_count'].includes(sort)) {
    return sort;
  }
  return 'pk_domain_id';
};

const blocksRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getDomainsOpts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          // Cursor-based pagination
          cursor: { type: 'string' },
          direction: {
            type: 'string',
            enum: [PAGINATION_DIRECTIONS.NEXT, PAGINATION_DIRECTIONS.PREV],
            default: PAGINATION_DIRECTIONS.NEXT,
          },
          // Common parameters
          limit: {
            type: 'integer',
            default: DEFAULT_REQUEST_ITEMS_LIMIT,
            minimum: 1,
            maximum: DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
          },
          order: { type: 'string', enum: ['asc', 'desc'] },
          sort: {
            type: 'string',
            default: 'pk_domain_id',
            enum: ['pk_domain_id', 'handle_count', 'expiration_timestamp'],
          },
          only_public: { type: 'boolean', default: false },
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
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
            nextCursor: { type: ['string', 'null'] },
            prevCursor: { type: ['string', 'null'] },
            total: { type: 'number' },
            active: { type: 'number' },
          },
          required: [
            'data',
            'hasNextPage',
            'hasPrevPage',
            'nextCursor',
            'prevCursor',
            'total',
            'active',
          ],
        },
      },
      tags: ['domain'],
      summary: 'Get domains with cursor pagination',
      description: 'Get domains using cursor-based pagination for optimal performance',
    },
  };

  server.get<DomainsQuery>(
    '/',
    getDomainsOpts,
    async (request: FastifyRequest<DomainsQuery>, reply: FastifyReply) => {
      const {
        cursor,
        direction = PAGINATION_DIRECTIONS.NEXT,
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        order,
        sort = 'pk_domain_id',
        only_public = false,
      } = request.query;

      let resolvedOrder = order;
      if (!resolvedOrder) {
        resolvedOrder = sort === 'expiration_timestamp' ? 'asc' : 'desc';
      }

      try {
        const sortField = getSortField(sort);
        const whereClause = `domain_status = 'active'${only_public ? ' AND is_public = true' : ''}`;

        // Handle handle_count sort specially
        const selectColumns = `
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
        `;

        const joinClause = 'LEFT JOIN accounts a ON d.fk_owner_account_id = a.pk_account_id';

        // For handle_count sorting, we need to use a subquery in the ORDER BY
        const cursorColumn =
          sort === 'handle_count'
            ? '(SELECT COUNT(*) FROM handles h WHERE h.fk_domain_id = d.pk_domain_id)'
            : sort === 'expiration_timestamp'
              ? `d.${sortField}, d.pk_domain_id`
              : `d.${sortField}`;

        // Parse cursor if it exists
        let parsedCursor = cursor;
        if (cursor) {
          try {
            if (cursor.trim().startsWith('{')) {
              const cursorObj = JSON.parse(cursor);
              parsedCursor = cursorObj.sortValue;
            } else {
              // Cursor passed as raw value (e.g., timestamp string)
              parsedCursor = cursor;
            }
          } catch (e) {
            console.error('Error parsing cursor:', e);
            throw new Error('Invalid cursor format');
          }
        }

        // Get total counts first
        const [total, active] = await Promise.all([
          CursorPagination.getTotalCount({
            table: 'domains d',
          }),
          CursorPagination.getTotalCount({
            table: 'domains',
            whereClause: "domain_status = 'active'",
          }),
        ]);

        const result = await CursorPagination.paginate<Domain>({
          table: 'domains d',
          cursorColumn,
          orderDirection: resolvedOrder.toUpperCase() as 'ASC' | 'DESC',
          limit,
          cursor: parsedCursor,
          direction,
          whereClause,
          selectColumns,
          joinClause,
          resultField: sort,
          isTimestampSort: sort === 'expiration_timestamp',
        });

        // Format cursors for response
        let nextCursor = result.nextCursor;
        let prevCursor = result.prevCursor;
        if (nextCursor) {
          const lastRow = result.data[result.data.length - 1];
          nextCursor = JSON.stringify({
            sortValue: nextCursor,
            pk_domain_id: lastRow.pk_domain_id,
          });
        }
        if (prevCursor) {
          const firstRow = result.data[0];
          prevCursor = JSON.stringify({
            sortValue: prevCursor,
            pk_domain_id: firstRow.pk_domain_id,
          });
        }

        const response: CursorDomainsResponse = {
          data: result.data,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          nextCursor,
          prevCursor,
          total,
          active,
        };

        return reply.send(response);
      } catch (error) {
        console.error('Error in domains pagination:', error);
        return reply.code(500).send({ error: 'An error occurred while fetching domains' });
      }
    }
  );
};

export default blocksRoute;
