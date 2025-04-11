import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { API_PREFIX } from '@shared/constants/network';

// Import routes
import * as healthCheckRoute from './health-check';
import * as searchRoute from './search';
import * as getStatsRoute from './stats';
import * as blocksRoute from './blocks';
import * as blockRoute from './block';
import * as currentBlockRoute from './current-block';
import * as handlesRoute from './handles';
import { getTransactionsRoute, getTransactionByIdRoute, getTransactionStatsRoute } from './transactions/index';

interface RouteConfig {
  plugin: FastifyPluginAsync;
  prefix: string;
}

const routes: RouteConfig[] = [
  { plugin: healthCheckRoute.default, prefix: `/${API_PREFIX}/health-check` },
  { plugin: getStatsRoute.default, prefix: `/${API_PREFIX}/stats` },
  { plugin: searchRoute.default, prefix: `/${API_PREFIX}/search` },
  { plugin: blocksRoute.default, prefix: `/${API_PREFIX}/blocks` },
  { plugin: blockRoute.default, prefix: `/${API_PREFIX}/blocks/:block_number` },
  { plugin: currentBlockRoute.default, prefix: `/${API_PREFIX}/current-block` },
  { plugin: getTransactionsRoute, prefix: `/${API_PREFIX}/transactions` },
  { plugin: getTransactionStatsRoute, prefix: `/${API_PREFIX}/transactions/stats` },
  { plugin: getTransactionByIdRoute, prefix: `/${API_PREFIX}/transactions/:id` },
  { plugin: handlesRoute.default, prefix: `/${API_PREFIX}/handles` },
];

export const registerRoutes = async (server: FastifyInstance): Promise<void> => {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    server.register(route.plugin, { prefix: route.prefix });
  }
};
