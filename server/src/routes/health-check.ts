import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

const healthCheckRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Health check endpoint
  const getHealthCheckOpts: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                uptime: { type: 'number' },
                timestamp: { type: 'string' }
              }
            }
          }
        }
      },
      tags: ['system'],
      summary: 'Health Check',
      description: 'Check if the API is running properly'
    }
  };

  server.get('/', getHealthCheckOpts, async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      data: {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    };
  });
};

export default healthCheckRoute;
