import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';

import config from '../config';

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyCors, {
    origin: !config.isDev 
      ? config.server.clientUrl 
      : true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
});
