import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import { getROE } from '../services/external/roe';

const roeRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // ROE endpoint
  const getRoeOpts: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                roe: { type: 'string' },
              }
            }
          }
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      },
      tags: ['market'],
      summary: 'Get FIO ROE (Rate of Exchange)',
      description: 'Get the current rate of exchange for FIO token'
    }
  };

  server.get('/', getRoeOpts, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const roeValue = await getROE();
      return {
        data: {
          roe: roeValue,
        }
      };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Failed to fetch ROE data'
      });
    }
  });
};

export default roeRoute; 
