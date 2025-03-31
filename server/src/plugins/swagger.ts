import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import config from '../config';

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Fullstack Application API',
        description: 'API documentation for the Fullstack Application',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: `${config.server.host}:${config.server.port}`,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'health-check', description: 'Health check related end-points' },
      ],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
}); 