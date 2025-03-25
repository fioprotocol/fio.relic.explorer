import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyCors, {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CLIENT_URL 
      : true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
}); 