import Fastify from 'fastify';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
import config from './config';
import pool from './config/database'; // Import the database pool

// Load environment variables
dotenv.config();

// Import plugins
import swagger from './plugins/swagger';
import cors from './plugins/cors';

// Import routes
import * as healthCheckRoute from './routes/health-check';
import * as transactionsByDateRoute from './routes/transactions-stats';

const server = Fastify({
  logger: {
    transport: config.isDev 
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
server.register(transactionsByDateRoute.default, { prefix: '/api/transactions-stats' });

// Root route
server.get('/', async () => {
  return { message: 'Welcome to the Fastify API' };
});

// Run the server
const start = async () => {
  try {
    // Test database connection before starting the server
    const client = await pool.connect();
    server.log.info('Successfully connected to the database');
    client.release();
  } catch (err) {
    server.log.error(err);
  }

  try {
    // Start the server after successful database connection
    await server.listen({ 
      port: config.server.port,
      host: config.server.host,
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