import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
// import { FromSchema } from 'json-schema-to-ts';

import pool from 'src/config/database';
// import { Block } from '../../types';
import {
  DEFAULT_MAX_REQUEST_ITEMS_LIMIT,
  DEFAULT_REQUEST_ITEMS_LIMIT,
} from '@shared/constants/network';
import { Block, CursorBlocksResponse } from '@shared/types/blocks';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';
import { CursorPagination } from 'src/utils/cursorPagination';

interface CursorPaginationQuery {
  Querystring: {
    cursor?: string;
    direction?: PaginationDirection;
    limit?: number;
  };
}

const blocksRoutes = async (fastify: FastifyInstance) => {
  const getBlocksOpts = {
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
                  pk_block_number: { type: 'string' },
                  stamp: { type: 'string' },
                  block_id: { type: 'string' },
                  producer_account_name: { type: 'string' },
                  schedule_version: { type: 'number' },
                  transactions_count: { type: 'number' },
                },
              },
            },
            total: { type: 'number' },
            current_block: {
              type: 'object',
              properties: {
                pk_block_number: { type: 'string' },
                stamp: { type: 'string' },
                block_id: { type: 'string' },
                producer_account_name: { type: 'string' },
                schedule_version: { type: 'number' },
                transactions_count: { type: 'number' },
              },
              nullable: true,
            },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
            nextCursor: { type: ['string', 'null'] },
            prevCursor: { type: ['string', 'null'] },
          },
        },
      },
      tags: ['blocks'],
      summary: 'Blocks',
      description: 'Get blocks list with cursor pagination',
    },
  };

  fastify.get(
    '/',
    getBlocksOpts,
    async (
      request: FastifyRequest<CursorPaginationQuery>,
      reply: FastifyReply
    ): Promise<CursorBlocksResponse> => {
      const {
        cursor,
        direction = PAGINATION_DIRECTIONS.NEXT,
        limit = DEFAULT_REQUEST_ITEMS_LIMIT,
      } = request.query;

      const selectColumns = `
        b.pk_block_number,
        b.stamp,
        b.block_id,
        b.producer_account_name,
        b.schedule_version,
        (SELECT COUNT(*) FROM transactions t WHERE t.fk_block_number = b.pk_block_number) as transactions_count
      `;

      // Pre-fetch total count using MAX() for performance
      const totalQuery = `SELECT MAX(pk_block_number) as total FROM blocks`;
      const totalResult = await pool.query(totalQuery);
      const total = parseInt(totalResult.rows[0].total);

      // Fetch the current block and the paginated data in parallel
      const currentBlockQuery = `SELECT ${selectColumns} FROM blocks b ORDER BY b.pk_block_number DESC LIMIT 1`;

      const [result, currentBlockResult] = await Promise.all([
        CursorPagination.paginate<Block>({
          table: 'blocks b',
          cursorColumn: 'b.pk_block_number',
          orderDirection: 'DESC',
          limit,
          cursor,
          direction,
          selectColumns,
        }),
        pool.query(currentBlockQuery),
      ]);

      return {
        data: result.data,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextCursor: result.nextCursor,
        prevCursor: result.prevCursor,
        total,
        current_block: currentBlockResult.rows[0],
      };
    }
  );
};

export default blocksRoutes;
