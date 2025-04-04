import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from '../config/database';

const transactionsByDateRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Transactions by date endpoint
  const getTransactionsByDateOpts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          days: { type: 'integer', default: 7, minimum: 1, maximum: 90 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                transactions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: { date: { type: 'string' }, transactions: { type: 'number' } },
                  },
                },
              },
            },
          },
        },
      },
      tags: ['transactions'],
      summary: 'Get transactions by date',
      description: 'Get transactions by date',
    },
  };

  server.get('/', getTransactionsByDateOpts, async (request: FastifyRequest, reply: FastifyReply) => {
    const { days = 7 } = request.query as { days?: number };
    
    const query = {
      text: `
        WITH date_series AS (
          SELECT generate_series(
            CURRENT_DATE - ($1 || ' days')::INTERVAL,
            CURRENT_DATE,
            INTERVAL '1 day'
          )::DATE AS date
        ),
        daily_counts AS (
          SELECT 
            DATE(block_timestamp) as date,
            COUNT(*) as transactions
          FROM transactions
          WHERE block_timestamp >= CURRENT_DATE - ($2 || ' days')::INTERVAL
          GROUP BY DATE(block_timestamp)
        )
        SELECT
          ds.date,
          COALESCE(dc.transactions, 0) as transactions
        FROM date_series ds
        LEFT JOIN daily_counts dc ON ds.date = dc.date
        ORDER BY ds.date ASC
      `,
      values: [days - 1, days]
    };
    
    const result = await pool.query(query);

    // Transform query results to return format
    const transactions = result.rows.map(row => ({
      date: row.date.toISOString().split('T')[0],
      transactions: parseInt(row.transactions)
    }));
    
    return {
      data: {
        transactions
      },
    };
  });
};

export default transactionsByDateRoute;
