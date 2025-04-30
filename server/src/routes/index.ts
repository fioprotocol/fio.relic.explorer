import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { API_PREFIX } from '@shared/constants/network';

// Import routes
import * as healthCheckRoute from './health-check';
import * as searchRoute from './search';
import * as getStatsRoute from './stats';
import * as roeRoute from './roe';
import { blocksRoute, blockRoute, currentBlockRoute, blocksDateRoute } from './blocks/index';
import { handleTransactionsRoute, handlesRoute, handleRoute } from './handles/index';
import { domainsRoute, domainRoute, domainsTransactionsRoute, domainsHandlesRoute } from './domains/index';
import {
  getTransactionsRoute,
  getTransactionByIdRoute,
  getTransactionStatsRoute,
} from './transactions/index';
import { accountsRoute } from './accounts/index';

interface RouteConfig {
  plugin: FastifyPluginAsync;
  prefix: string;
}

const routes: RouteConfig[] = [
  { plugin: healthCheckRoute.default, prefix: `/${API_PREFIX}/health-check` },
  { plugin: getStatsRoute.default, prefix: `/${API_PREFIX}/stats` },
  { plugin: searchRoute.default, prefix: `/${API_PREFIX}/search` },
  { plugin: roeRoute.default, prefix: `/${API_PREFIX}/roe` },
  { plugin: blocksRoute, prefix: `/${API_PREFIX}/blocks` },
  { plugin: currentBlockRoute, prefix: `/${API_PREFIX}/blocks/current` },
  { plugin: blocksDateRoute, prefix: `/${API_PREFIX}/blocks/date` },
  { plugin: blockRoute, prefix: `/${API_PREFIX}/blocks/:block_number` },
  { plugin: getTransactionsRoute, prefix: `/${API_PREFIX}/transactions` },
  { plugin: getTransactionByIdRoute, prefix: `/${API_PREFIX}/transactions/:id` },
  { plugin: getTransactionStatsRoute, prefix: `/${API_PREFIX}/transactions/stats` },
  { plugin: handlesRoute, prefix: `/${API_PREFIX}/handles` },
  { plugin: handleRoute, prefix: `/${API_PREFIX}/handles/:handle` },
  {
    plugin: handleTransactionsRoute,
    prefix: `/${API_PREFIX}/handles/:handle/transactions`,
  },
  { plugin: domainsRoute, prefix: `/${API_PREFIX}/domains` },
  { plugin: domainRoute, prefix: `/${API_PREFIX}/domains/:domain` },
  { plugin: domainsTransactionsRoute, prefix: `/${API_PREFIX}/domains/:domain/transactions` },
  { plugin: domainsHandlesRoute, prefix: `/${API_PREFIX}/domains/:domain/handles` },
  { plugin: accountsRoute, prefix: `/${API_PREFIX}/accounts` },
];

export const registerRoutes = async (server: FastifyInstance): Promise<void> => {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    server.register(route.plugin, { prefix: route.prefix });
  }
};
