import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { API_PREFIX } from '@shared/constants/network';

// Import routes
import * as healthCheckRoute from './health-check';
import * as searchRoute from './search';
import * as getStatsRoute from './stats';
import * as transactionsRoute from './transactions';

interface RouteConfig {
  plugin: FastifyPluginAsync;
  prefix: string;
}

const routes: RouteConfig[] = [
  { plugin: healthCheckRoute.default, prefix: `/${API_PREFIX}/health-check` },
  { plugin: getStatsRoute.default, prefix: `/${API_PREFIX}/stats` },
  { plugin: searchRoute.default, prefix: `/${API_PREFIX}/search` },
  { plugin: transactionsRoute.default, prefix: `/${API_PREFIX}/transactions` },
];

export const registerRoutes = async (server: FastifyInstance): Promise<void> => {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    server.register(route.plugin, { prefix: route.prefix });
  }
};
