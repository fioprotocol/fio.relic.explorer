import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

import pool from '../config/database';

import { ChainInfoResponse } from '@shared/types/fio-api-server';
import { NODE_URLS } from '@shared/constants/fio';

const getStatsRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Transactions by date endpoint
  const getStatsOpts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          days: { type: 'integer', default: 7, minimum: 1, maximum: 90 },
          useLastRecord: { type: 'boolean', default: false }
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
                fioHandlesRegistered: { type: 'number' },
                fioHandlesActive: { type: 'number' },
                fioDomainsRegistered: { type: 'number' },
                fioDomainsActive: { type: 'number' },
                latestBlock: { type: 'number' },
                latestIrreversibleBlock: { type: 'number' },
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

  server.get('/', getStatsOpts, async (request: FastifyRequest, reply: FastifyReply) => {
    const { days = 7, useLastRecord = false } = request.query as { days?: number, useLastRecord?: boolean };
    
    // Query for transactions by date
    const transactionsQuery = {
      text: `
        WITH date_series AS (
          SELECT generate_series(
            CASE 
              WHEN $2 = true THEN (SELECT DATE(block_timestamp) FROM transactions ORDER BY block_timestamp DESC LIMIT 1) - ($1 || ' days')::INTERVAL
              ELSE CURRENT_DATE - ($1 || ' days')::INTERVAL
            END,
            CASE 
              WHEN $2 = true THEN (SELECT DATE(block_timestamp) FROM transactions ORDER BY block_timestamp DESC LIMIT 1)
              ELSE CURRENT_DATE
            END,
            INTERVAL '1 day'
          )::DATE AS date
        ),
        daily_counts AS (
          SELECT 
            DATE(block_timestamp) as date,
            COUNT(*) as transactions
          FROM transactions
          WHERE block_timestamp >= CASE 
            WHEN $2 = true THEN (SELECT block_timestamp FROM transactions ORDER BY block_timestamp DESC LIMIT 1) - ($1 || ' days')::INTERVAL
            ELSE CURRENT_DATE - ($1 || ' days')::INTERVAL
          END
          GROUP BY DATE(block_timestamp)
        )
        SELECT
          ds.date,
          COALESCE(dc.transactions, 0) as transactions
        FROM date_series ds
        LEFT JOIN daily_counts dc ON ds.date = dc.date
        ORDER BY ds.date ASC
      `,
      values: [days, useLastRecord]
    };
    
    // Query for FIO metrics
    const metricsQuery = {
      text: `
        SELECT
          (SELECT COUNT(*) FROM handles) as fio_handles_registered,
          (SELECT COUNT(*) FROM handles WHERE handle_status = 'active') as fio_handles_active,
          (SELECT COUNT(*) FROM domains) as fio_domains_registered,
          (SELECT COUNT(*) FROM domains WHERE domain_status = 'active') as fio_domains_active
      `
    };
    
    // Execute both queries
    const [transactionsResult, metricsResult] = await Promise.all([
      pool.query(transactionsQuery),
      pool.query(metricsQuery)
    ]);

    const chainInfo = {
      latestBlock: 0,
      latestIrreversibleBlock: 0,
    };

    try {
      const chainInfoResponse = await fetch(`${NODE_URLS[0]}chain/get_info`); 
      const chainInfoData = await chainInfoResponse.json() as ChainInfoResponse;
      
      chainInfo.latestBlock = chainInfoData.head_block_num;
      chainInfo.latestIrreversibleBlock = chainInfoData.last_irreversible_block_num;
    } catch (error) {
      console.error('Error fetching chain info', error);
    }

    // Transform query results to return format
    const transactions = transactionsResult.rows.map(row => ({
      date: row.date.toISOString().split('T')[0],
      transactions: parseInt(row.transactions)
    }));
    
    // Get metrics from the metrics query
    const metrics = metricsResult.rows[0] || {
      fio_handles_registered: 0,
      fio_handles_active: 0,
      fio_domains_registered: 0,
      fio_domains_active: 0
    };
    
    return {
      data: {
        fioHandlesRegistered: parseInt(metrics.fio_handles_registered) || 0,
        fioHandlesActive: parseInt(metrics.fio_handles_active) || 0,
        fioDomainsRegistered: parseInt(metrics.fio_domains_registered) || 0,
        fioDomainsActive: parseInt(metrics.fio_domains_active) || 0,
        latestBlock: chainInfo.latestBlock,
        latestIrreversibleBlock: chainInfo.latestIrreversibleBlock,
        transactions
      },
    };
  });
};

export default getStatsRoute;
