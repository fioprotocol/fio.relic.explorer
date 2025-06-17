import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from 'src/config/database';

import {
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { CursorAccountsResponse, AccountSortOption, Account } from '@shared/types/accounts';
import { ACCOUNT_SORT_OPTIONS } from '@shared/constants/accounts';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';
import { CursorPagination } from 'src/utils/cursorPagination';

interface AccountsQuery {
  Querystring: {
    cursor?: string;
    direction?: PaginationDirection;
    limit?: number;
    order?: 'asc' | 'desc';
    sort?: AccountSortOption;
    include_total?: boolean;
  };
}

const accountsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getAccountsOpts: RouteShorthandOptions = {
    schema: {
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
            type: 'number',
            default: DEFAULT_REQUEST_ITEMS_LIMIT,
            maximum: DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
          },
          order: { type: 'string', enum: ['asc', 'desc'] },
          sort: {
            type: 'string',
            default: ACCOUNT_SORT_OPTIONS.ACCOUNT_ID,
            enum: Object.values(ACCOUNT_SORT_OPTIONS),
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
                  pk_account_id: { type: 'number' },
                  account_name: { type: 'string' },
                  handle_count: { type: 'number' },
                  domain_count: { type: 'number' },
                  fio_balance_suf: { type: 'string' },
                  block_timestamp: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
            nextCursor: { type: ['string', 'null'] },
            prevCursor: { type: ['string', 'null'] },
          },
        },
      },
      tags: ['accounts'],
      summary: 'Accounts',
      description: 'Get accounts list with cursor pagination',
    },
  };

  server.get<AccountsQuery>(
    '/',
    getAccountsOpts,
    async (
      request: FastifyRequest<AccountsQuery>,
      reply: FastifyReply
    ): Promise<CursorAccountsResponse> => {
      const {
        cursor,
        direction = PAGINATION_DIRECTIONS.NEXT,
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        sort = ACCOUNT_SORT_OPTIONS.ACCOUNT_ID,
        order: orderParam,
        include_total = false,
      } = request.query;

      let order = orderParam;
      if (!order) {
        // default order
        order =
          sort === ACCOUNT_SORT_OPTIONS.ACCOUNT_ID || sort === ACCOUNT_SORT_OPTIONS.BALANCE
            ? 'desc'
            : 'desc';
      }

      const selectColumns = `
        a.pk_account_id,
        a.account_name,
        a.fio_balance_suf,
        a.block_timestamp,
        COALESCE(h.handle_count, 0) as handle_count,
        COALESCE(d.domain_count, 0) as domain_count
      `;

      const joinClause = `
        LEFT JOIN (
          SELECT fk_owner_account_id, COUNT(*) as handle_count
          FROM handles
          GROUP BY fk_owner_account_id
        ) h ON a.pk_account_id = h.fk_owner_account_id
        LEFT JOIN (
          SELECT fk_owner_account_id, COUNT(*) as domain_count
          FROM domains
          GROUP BY fk_owner_account_id
        ) d ON a.pk_account_id = d.fk_owner_account_id
      `;

      const cursorColumn = (() => {
        switch (sort) {
          case ACCOUNT_SORT_OPTIONS.BALANCE:
            return 'a.fio_balance_suf';
          case ACCOUNT_SORT_OPTIONS.HANDLES:
            return 'handle_count';
          case ACCOUNT_SORT_OPTIONS.DOMAINS:
            return 'domain_count';
          default:
            return 'a.pk_account_id';
        }
      })();
      const cursorExpression = (() => {
        if (sort === ACCOUNT_SORT_OPTIONS.HANDLES) {
          return '(COALESCE(h.handle_count, 0))';
        }
        if (sort === ACCOUNT_SORT_OPTIONS.DOMAINS) {
          return '(COALESCE(d.domain_count, 0))';
        }
        return undefined;
      })();

      // Use an optimized path with CTE for simple sorts (ID and balance) for all pages
      const isSimpleSort =
        sort === ACCOUNT_SORT_OPTIONS.ACCOUNT_ID || sort === ACCOUNT_SORT_OPTIONS.BALANCE;

      const isCountSort =
        sort === ACCOUNT_SORT_OPTIONS.HANDLES || sort === ACCOUNT_SORT_OPTIONS.DOMAINS;

      // Helper to choose comparison operator based on sort order and navigation direction
      const getOperator = (o: 'asc' | 'desc', nav: PaginationDirection): string => {
        if (nav === PAGINATION_DIRECTIONS.NEXT) return o === 'desc' ? '<' : '>';
        return o === 'desc' ? '>' : '<';
      };

      if (isSimpleSort) {
        const effectiveOrder =
          direction === PAGINATION_DIRECTIONS.PREV ? (order === 'desc' ? 'asc' : 'desc') : order;

        const orderByField =
          sort === ACCOUNT_SORT_OPTIONS.BALANCE ? 'a.fio_balance_suf' : 'a.pk_account_id';

        let cursorWhere = '';
        const queryParams: (string | number)[] = [];

        if (cursor) {
          if (sort === ACCOUNT_SORT_OPTIONS.BALANCE && cursor.trim().startsWith('{')) {
            // Composite cursor with balance and pk_account_id
            const { balance: cursorBalance, pk_account_id: cursorId } = JSON.parse(cursor);

            // For balance duplicates, compare balance first, then id as tiebreaker
            cursorWhere = `WHERE (${orderByField} ${getOperator(order, direction)} $1 OR (${orderByField} = $1 AND a.pk_account_id ${getOperator(order, direction)} $2))`;
            queryParams.push(cursorBalance, cursorId);
          } else {
            cursorWhere = `WHERE ${orderByField} ${getOperator(order, direction)} $1`;
            queryParams.push(cursor);
          }
        }

        const limitParamIndex = queryParams.length + 1;
        queryParams.push(limit + 1);

        const optimizedQuery = `
          WITH sorted_accounts AS (
            SELECT a.pk_account_id, a.account_name, a.fio_balance_suf, a.block_timestamp
            FROM accounts a
            ${cursorWhere}
            ORDER BY ${orderByField} ${effectiveOrder}, a.pk_account_id ${effectiveOrder}
            LIMIT $${limitParamIndex}
          )
          SELECT
            sa.pk_account_id,
            sa.account_name, sa.fio_balance_suf, sa.block_timestamp,
            COALESCE(h.handle_count, 0) AS handle_count,
            COALESCE(d.domain_count, 0) AS domain_count
          FROM sorted_accounts sa
          ${joinClause.replace(/a\.pk_account_id/g, 'sa.pk_account_id')}
          ORDER BY ${orderByField.replace('a.', 'sa.')} ${effectiveOrder}, sa.pk_account_id ${effectiveOrder}
        `;

        let { rows } = await pool.query(optimizedQuery, queryParams);

        const hasMoreInDirection = rows.length > limit;

        // Correctly handle slicing and reversing for 'previous' direction
        if (hasMoreInDirection) {
          rows = rows.slice(0, limit);
        }
        if (direction === PAGINATION_DIRECTIONS.PREV) {
          rows.reverse();
        }
        const data = rows;

        let hasNextPage, hasPrevPage;
        if (direction === PAGINATION_DIRECTIONS.NEXT) {
          hasNextPage = hasMoreInDirection;
          hasPrevPage = !!cursor;
        } else {
          hasNextPage = !!cursor;
          hasPrevPage = hasMoreInDirection;
        }

        let nextCursor: string | null = null;
        let prevCursor: string | null = null;

        if (hasNextPage && data.length > 0) {
          if (sort === ACCOUNT_SORT_OPTIONS.BALANCE) {
            nextCursor = JSON.stringify({
              balance: data[data.length - 1].fio_balance_suf,
              pk_account_id: data[data.length - 1].pk_account_id,
            });
          } else {
            nextCursor = String(data[data.length - 1].pk_account_id);
          }
        }

        if (hasPrevPage && data.length > 0) {
          if (sort === ACCOUNT_SORT_OPTIONS.BALANCE) {
            prevCursor = JSON.stringify({
              balance: data[0].fio_balance_suf,
              pk_account_id: data[0].pk_account_id,
            });
          } else {
            prevCursor = String(data[0].pk_account_id);
          }
        }

        let total: number | undefined;
        if (include_total) {
          total = await CursorPagination.getTotalCount({ table: 'accounts' });
        }

        return {
          data,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
          nextCursor: nextCursor,
          prevCursor: prevCursor,
          total,
        } as CursorAccountsResponse;
      }

      /* ------------------------------------------------------------------
       *  Optimized cursor pagination for HANDLE / DOMAIN count sorts
       * ------------------------------------------------------------------ */
      if (isCountSort) {
        const countColumnAlias = sort === ACCOUNT_SORT_OPTIONS.HANDLES ? 'handle_count' : 'domain_count';
        const countColumnExpr = sort === ACCOUNT_SORT_OPTIONS.HANDLES ? 'COALESCE(h.handle_count,0)' : 'COALESCE(d.domain_count,0)';

        const effectiveOrder =
          direction === PAGINATION_DIRECTIONS.PREV ? (order === 'desc' ? 'asc' : 'desc') : order;

        let cursorWhere = '';
        const queryParams: (string | number)[] = [];

        if (cursor) {
          const mainOp = getOperator(order, direction);
          const idOp = mainOp; // same operator suffices for stable ordering

          if (cursor.trim().startsWith('{')) {
            const { count: cursorCount, pk_account_id: cursorId } = JSON.parse(cursor);
            cursorWhere = `WHERE (${countColumnExpr} ${mainOp} $1 OR (${countColumnExpr} = $1 AND a.pk_account_id ${idOp} $2))`;
            queryParams.push(cursorCount, cursorId);
          } else {
            cursorWhere = `WHERE ${countColumnExpr} ${mainOp} $1`;
            queryParams.push(cursor);
          }
        }

        const limitParamIndex = queryParams.length + 1;
        queryParams.push(limit + 1);

        const baseSelect = `
          SELECT a.pk_account_id, a.account_name, a.block_timestamp, a.fio_balance_suf,
                 COALESCE(h.handle_count, 0) AS handle_count,
                 COALESCE(d.domain_count, 0) AS domain_count
          FROM accounts a
          ${joinClause}
        `;

        const optimizedQuery = `
          WITH sorted_accounts AS (
            ${baseSelect}
            ${cursorWhere}
            ORDER BY ${countColumnExpr} ${effectiveOrder}, a.pk_account_id ${effectiveOrder}
            LIMIT $${limitParamIndex}
          )
          SELECT * FROM sorted_accounts
          ORDER BY ${countColumnAlias} ${effectiveOrder}, pk_account_id ${effectiveOrder};
        `;

        let { rows } = await pool.query(optimizedQuery, queryParams);

        const hasMoreInDirection = rows.length > limit;
        if (hasMoreInDirection) rows = rows.slice(0, limit);
        if (direction === PAGINATION_DIRECTIONS.PREV) rows.reverse();

        const data = rows as Account[];

        const hasNextPage =
          direction === PAGINATION_DIRECTIONS.NEXT ? hasMoreInDirection : !!cursor;
        const hasPrevPage =
          direction === PAGINATION_DIRECTIONS.NEXT ? !!cursor : hasMoreInDirection;

        let nextCursor: string | null = null;
        let prevCursor: string | null = null;

        if (hasNextPage && data.length > 0) {
          nextCursor = JSON.stringify({
            count: data[data.length - 1][countColumnAlias as keyof Account],
            pk_account_id: data[data.length - 1].pk_account_id,
          });
        }

        if (hasPrevPage && data.length > 0) {
          prevCursor = JSON.stringify({
            count: data[0][countColumnAlias as keyof Account],
            pk_account_id: data[0].pk_account_id,
          });
        }

        let total: number | undefined;
        if (include_total) {
          total = await CursorPagination.getTotalCount({ table: 'accounts' });
        }

        return {
          data,
          hasNextPage,
          hasPrevPage,
          nextCursor,
          prevCursor,
          ...(total !== undefined && { total }),
        } as CursorAccountsResponse;
      }

      const result = await CursorPagination.paginate<Account>({
        table: 'accounts a',
        cursorColumn,
        orderDirection: order.toUpperCase() as 'ASC' | 'DESC',
        limit,
        cursor,
        direction,
        selectColumns,
        joinClause,
        resultField: sort,
        cursorExpression,
      });

      let total: number | undefined;
      if (include_total) {
        total = await CursorPagination.getTotalCount({ table: 'accounts' });
      }

      return {
        data: result.data,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextCursor: result.nextCursor,
        prevCursor: result.prevCursor,
        ...(total !== undefined && { total }),
      } as CursorAccountsResponse;
    }
  );
};

export default accountsRoute;
