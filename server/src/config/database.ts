import { Pool } from 'pg';
import dotenv from 'dotenv';

import { createSSHTunnel } from './ssh-tunnel';

// Load environment variables
dotenv.config();

// Initialize SSH tunnel if needed
const sshTunnel = createSSHTunnel();

// Function to get database configuration
const getDatabaseConfig = async () => {
  let dbHost = process.env.DB_HOST || 'localhost';
  let dbPort = parseInt(process.env.DB_PORT || '5432');

  // If SSH tunnel is configured, establish it and use localhost
  if (sshTunnel) {
    try {
      const localPort = await sshTunnel.connect();
      dbHost = '127.0.0.1';
      dbPort = localPort;
      console.log(`Using SSH tunnel: connecting to database via localhost:${localPort}`);
    } catch (error) {
      console.error('Failed to establish SSH tunnel, falling back to direct connection:', error);
      // Fall back to direct connection
      dbHost = process.env.DB_HOST || 'localhost';
      dbPort = parseInt(process.env.DB_PORT || '5432');
    }
  }

  return {
    host: dbHost,
    port: dbPort,
    database: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : undefined,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 300000, // 5 minutes before an idle client is closed
    allowExitOnIdle: false, // keep Node process alive even when pool is idle
    keepAlive: true, // ensure TCP keep-alives are sent
    keepAliveInitialDelayMillis: 30000, // 30-s delay before first keep-alive packet
    connectionTimeoutMillis: 10000, // Increased timeout for SSH connections
  };
};

// Create pool with async configuration
let pool: Pool | undefined;
let signalHandlersRegistered = false; // Track if signal handlers are already registered

const initializePool = async (): Promise<Pool> => {
  const config = await getDatabaseConfig();
  pool = new Pool(config);
  
  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  // Register signal handlers only once
  if (!signalHandlersRegistered) {
    signalHandlersRegistered = true;
    
    // Handle process termination - only in production or explicit shutdown
    const handleShutdown = async (signal: string) => {
      console.log(`Received ${signal}, closing database pool and SSH tunnel...`);
      try {
        if (pool && !(pool as any).ended) {
          await pool.end();
        }
        if (sshTunnel) {
          await sshTunnel.disconnect();
        }
        console.log('Cleanup completed successfully');
        process.exit(0);
      } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
      }
    };

    // Only register signal handlers in production or when explicitly requested
    if (process.env.NODE_ENV === 'production' || process.env.HANDLE_SIGNALS === 'true') {
      process.on('SIGINT', () => handleShutdown('SIGINT'));
      process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    }
  }

  // Pre-warm the pool so first real request is fast
  try {
    await pool.query('SELECT 1');
  } catch (warmErr) {
    console.warn('Database pre-warm query failed:', warmErr);
  }

  return pool;
};

// Export a promise that resolves to the initialized pool
export const getPool = async (): Promise<Pool> => {
  if (!pool || (pool as any).ended) {
    console.log('Initializing new database pool...');
    await initializePool();
  }
  return pool!; // We know pool is defined after initializePool
};

// Synchronous pool getter for backward compatibility
// This will throw an error if called before pool is initialized
export const getPoolSync = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized. Make sure to call getPool() first or wait for initialization.');
  }
  return pool;
};

// For backward compatibility, create a proxy object that will work once pool is initialized
const poolProxy = new Proxy({} as Pool, {
  get(target, prop) {
    if (!pool || (pool as any).ended) {
      // If pool is not initialized or has been ended, throw a clear error
      throw new Error('Database pool not available. The pool may have been closed. Please restart the server.');
    }
    return (pool as any)[prop];
  }
});

// For backward compatibility, export the pool proxy
export default poolProxy;

// Immediately initialise and warm the pool at application startup
(async () => {
  try {
    await initializePool();
    console.log('Database pool initialised and warmed');
  } catch (initErr) {
    console.error('Failed to initialise database pool at startup:', initErr);
  }
})();
