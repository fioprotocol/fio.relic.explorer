import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import Big from 'big.js';
import pool from '../../config/database';
import { TransactionStats } from '@shared/types/transactions';
import { DEFAULT_TRANSACTION_STATS_DAYS } from '@shared/constants/network';

const getTransactionStatsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Get transaction stats endpoint
  const getTransactionStatsOpts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          days: { type: 'integer', default: DEFAULT_TRANSACTION_STATS_DAYS, minimum: 1 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            transactionsCount: { type: 'integer' },
            transactionFees: { type: 'number' },
            avgTransactionFee: { type: 'number' }
          }
        }
      },
      tags: ['transactions'],
      summary: 'Get transaction statistics for the specified number of days',
      description: 'Get count, total fees and average fee of transactions for the specified number of days from the latest transaction date',
    },
  };

  server.get('/', getTransactionStatsOpts, async (request: FastifyRequest, reply: FastifyReply) => {
    const { days = DEFAULT_TRANSACTION_STATS_DAYS } = request.query as { days?: number };
    
    // First, get the latest transaction date from the database
    const latestDateQuery = {
      text: `
        SELECT MAX(block_timestamp) as latest_date
        FROM transactions
      `,
      values: []
    };
    
    const latestDateResult = await pool.query(latestDateQuery);
    const latestDate = latestDateResult.rows[0].latest_date;
    
    if (!latestDate) {
      // If no transactions exist, return zeros
      return {
        transactionsCount: 0,
        transactionFees: 0,
        avgTransactionFee: 0
      };
    }
    
    // Query for transaction count for the specified days from the latest date
    const transactionCountQuery = {
      text: `
        SELECT COUNT(*) as count
        FROM transactions
        WHERE block_timestamp >= (SELECT MAX(block_timestamp) FROM transactions) - INTERVAL '${days} days'
      `,
      values: []
    };
    
    // Query for sum of fees for the specified days from the latest date
    const transactionFeesQuery = {
      text: `
        SELECT COALESCE(SUM(fee), 0) as total_fees
        FROM transactions
        WHERE block_timestamp >= (SELECT MAX(block_timestamp) FROM transactions) - INTERVAL '${days} days'
      `,
      values: []
    };
    
    // Query for count of transactions with fee > 0 for the specified days from the latest date
    const paidTransactionsCountQuery = {
      text: `
        SELECT COUNT(*) as paid_count
        FROM transactions
        WHERE block_timestamp >= (SELECT MAX(block_timestamp) FROM transactions) - INTERVAL '${days} days'
        AND fee > 0
      `,
      values: []
    };
    
    // Execute all queries
    const [countResult, feesResult, paidCountResult] = await Promise.all([
      pool.query(transactionCountQuery),
      pool.query(transactionFeesQuery),
      pool.query(paidTransactionsCountQuery)
    ]);

    const transactionsCount = parseInt(countResult.rows[0].count);
    const totalFees = new Big(feesResult.rows[0].total_fees || 0);
    const paidTransactionsCount = parseInt(paidCountResult.rows[0].paid_count);
        
    // Calculate average fee
    let avgTransactionFee = '0';
    if (paidTransactionsCount > 0) {
      avgTransactionFee = totalFees.div(paidTransactionsCount).toString();
    }
    
    const response: TransactionStats = {
      transactionsCount,
      transactionFees: totalFees.toString(),
      avgTransactionFee
    };
    
    return response;
  });
};

export default getTransactionStatsRoute;
