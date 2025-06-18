import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import pool from 'src/config/database';
import {
  DEFAULT_REQUEST_ITEMS_LIMIT,
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { AccountTransaction } from '@shared/types/accounts';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';
import { CursorResponse } from '@shared/types/general';

interface AccountTransactionsQuery {
  Params: {
    account: string;
  };
  Querystring: {
    limit?: number;
    cursor?: string;
    direction?: PaginationDirection;
    include_total?: boolean;
  };
}

const accountTransactionsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  const getTransactionsOpts: RouteShorthandOptions = {
    schema: {
      params: {
        type: 'object',
        properties: {
          account: { type: 'string' },
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
                  pk_transaction_id: { type: 'number' },
                  transaction_id: { type: 'string' },
                  block_timestamp: { type: 'string' },
                  action_name: { type: 'string' },
                  fee: { type: 'string' },
                  fio_tokens: { type: ['string', 'null'] },
                  transaction_type: { type: 'string' },
                  request_data: { type: 'string' },
                  payer_public_key: { type: ['string', 'null'] },
                  payer_account_name: { type: ['string', 'null'] },
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
      tags: ['Accounts'],
      summary: 'Account Transactions with cursor pagination',
      description: 'Get transactions for a specific account using cursor-based pagination',
    },
  };

  server.get<AccountTransactionsQuery>(
    '/',
    getTransactionsOpts,
    async (
      request: FastifyRequest<AccountTransactionsQuery>,
      reply: FastifyReply
    ): Promise<CursorResponse<{ data: AccountTransaction[] }>> => {
      const {
        cursor,
        direction = PAGINATION_DIRECTIONS.NEXT,
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
        include_total = false,
      } = request.query;

      const { account } = request.params;

      try {
        // Retrieve account_id first
        const accountResult = await pool.query(
          'SELECT pk_account_id FROM accounts WHERE account_name = $1',
          [account]
        );

        if (accountResult.rows.length === 0) {
          return reply.send({
            data: [],
            hasNextPage: false,
            hasPrevPage: false,
            nextCursor: null,
            prevCursor: null,
            total: 0,
          });
        }

        const accountId = accountResult.rows[0].pk_account_id;

        // Build cursor condition
        let cursorCondition = '';
        const queryValues: (string | number)[] = [accountId];

        if (cursor) {
          const operator = direction === PAGINATION_DIRECTIONS.NEXT ? '<' : '>';
          cursorCondition = `AND pk_transaction_id ${operator} $${queryValues.length + 1}`;
          queryValues.push(cursor);
        }

        // Determine order direction for query
        const orderDirection = direction === PAGINATION_DIRECTIONS.PREV ? 'ASC' : 'DESC';

        // Build combined CTE query
        const limitPlus = limit + 1;
        queryValues.push(limitPlus);

        const combinedQuery = `
          WITH sender_transactions AS (
            SELECT
              t.pk_transaction_id,
              t.transaction_id,
              t.block_timestamp,
              t.action_name,
              t.fee,
              t.request_data,
              'SENDER' AS transaction_type,
              CAST(COALESCE(stt.total_amount, NULL) AS TEXT) AS fio_tokens,
              NULL::TEXT AS payer_public_key,
              NULL::TEXT AS payer_account_name
            FROM transactions t
            LEFT JOIN (
              SELECT fk_transaction_id, SUM(fio_suf_amount) AS total_amount
              FROM tokentransfers
              WHERE fk_payer_account_id = $1
              GROUP BY fk_transaction_id
            ) stt ON t.pk_transaction_id = stt.fk_transaction_id
            WHERE t.fk_account_id = $1
          ),
          receiver_account_activities AS (
            SELECT
              t.pk_transaction_id,
              t.transaction_id,
              t.block_timestamp,
              t.action_name,
              t.fee,
              t.request_data,
              'RECEIVER' AS transaction_type,
              CAST(COALESCE(rtt.total_amount, NULL) AS TEXT) AS fio_tokens,
              acc.public_key AS payer_public_key,
              acc.account_name AS payer_account_name
            FROM accountactivities aa
            JOIN transactions t ON aa.fk_transaction_id = t.pk_transaction_id
            JOIN accounts acc ON acc.pk_account_id = t.fk_account_id
            LEFT JOIN (
              SELECT fk_transaction_id, SUM(fio_suf_amount) AS total_amount
              FROM tokentransfers
              WHERE fk_payee_account_id = $1
              GROUP BY fk_transaction_id
            ) rtt ON t.pk_transaction_id = rtt.fk_transaction_id
            WHERE aa.fk_account_id = $1 AND t.fk_account_id <> $1
          ),
          receiver_token_transfers AS (
            SELECT
              t.pk_transaction_id,
              t.transaction_id,
              t.block_timestamp,
              t.action_name,
              t.fee,
              t.request_data,
              'RECEIVER' AS transaction_type,
              CAST(SUM(tt.fio_suf_amount) AS TEXT) AS fio_tokens,
              acc.public_key AS payer_public_key,
              acc.account_name AS payer_account_name
            FROM tokentransfers tt
            JOIN transactions t ON tt.fk_transaction_id = t.pk_transaction_id
            JOIN accounts acc ON acc.pk_account_id = tt.fk_payer_account_id
            WHERE tt.fk_payee_account_id = $1 AND t.fk_account_id <> $1
            GROUP BY t.pk_transaction_id, t.transaction_id, t.block_timestamp, t.action_name, t.fee, t.request_data, tt.fk_payer_account_id, acc.public_key, acc.account_name
          ),
          combined_transactions AS (
            SELECT * FROM sender_transactions
            UNION
            SELECT * FROM receiver_account_activities
            UNION
            SELECT * FROM receiver_token_transfers
          )
          SELECT * FROM combined_transactions
          WHERE 1=1 ${cursorCondition}
          ORDER BY pk_transaction_id ${orderDirection}
          LIMIT $${queryValues.length}
        `;

        let { rows } = await pool.query(combinedQuery, queryValues);

        const hasMorePages = rows.length > limit;
        if (hasMorePages) {
          rows = rows.slice(0, limit);
        }

        if (direction === PAGINATION_DIRECTIONS.PREV) {
          rows.reverse();
        }

        let hasNextPage: boolean;
        let hasPrevPage: boolean;

        if (direction === PAGINATION_DIRECTIONS.NEXT) {
          hasNextPage = hasMorePages;
          hasPrevPage = !!cursor;
        } else {
          hasNextPage = !!cursor;
          hasPrevPage = hasMorePages;
        }

        const nextCursor =
          hasNextPage && rows.length > 0 ? rows[rows.length - 1].pk_transaction_id : null;
        const prevCursor = hasPrevPage && rows.length > 0 ? rows[0].pk_transaction_id : null;

        let total: number | undefined;
        if (include_total) {
          const countQuery = {
            text: `
              WITH all_tx AS (
                SELECT pk_transaction_id FROM transactions WHERE fk_account_id = $1
                UNION
                SELECT fk_transaction_id AS pk_transaction_id FROM accountactivities WHERE fk_account_id = $1
                UNION
                SELECT fk_transaction_id AS pk_transaction_id FROM tokentransfers WHERE fk_payee_account_id = $1
              )
              SELECT COUNT(*) AS total FROM all_tx
            `,
            values: [accountId],
          };
          const countResult = await pool.query(countQuery.text, countQuery.values);
          total = parseInt(countResult.rows[0].total);
        }

        const response: CursorResponse<{ data: AccountTransaction[] }> = {
          data: rows,
          hasNextPage,
          hasPrevPage,
          nextCursor,
          prevCursor,
          ...(total !== undefined && { total }),
        };

        return reply.send(response);
      } catch (error) {
        console.error('Error fetching account transactions with cursor pagination:', error);
        return reply.code(500).send({ message: 'Internal server error' });
      }
    }
  );
};

export default accountTransactionsRoute;
