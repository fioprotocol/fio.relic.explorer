import Fastify from 'fastify';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';

// Load environment variables
dotenv.config();

// Import plugins
import swagger from './plugins/swagger';
import cors from './plugins/cors';

// Import routes
import * as healthCheckRoute from './routes/health-check';

const server = Fastify({
  logger: {
    transport: process.env.NODE_ENV === 'development' 
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          }
        }
      : undefined
  }
});

// Register plugins
server.register(cors);
server.register(swagger);

// Register routes
server.register(healthCheckRoute.default, { prefix: '/api/health-check' });

// Root route
server.get('/', async () => {
  return { message: 'Welcome to the Fastify API' };
});

// Run the server
const start = async () => {
  try {
    await server.listen({ 
      port: parseInt(process.env.PORT || '9090', 10),
      host: process.env.HOST || 'localhost'
    });
    
    const address = server.server.address();
    const port = typeof address === 'string' 
      ? address 
      : (address as AddressInfo)?.port;
      
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 