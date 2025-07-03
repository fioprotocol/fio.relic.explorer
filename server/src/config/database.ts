import { Pool } from 'pg';
import { createTunnel } from 'tunnel-ssh';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Function to decode base64 SSH key if needed
const decodeSSHKey = (keyString: string): string => {
  if (!keyString) return keyString;
  
  // If it's already a regular SSH key or file path, return as-is
  if (keyString.includes('-----BEGIN') || 
      keyString.includes('ssh-rsa') || 
      keyString.includes('ssh-ed25519') ||
      keyString.includes('/') ||  // likely a file path
      keyString.includes('\\')) { // Windows file path
    return keyString;
  }
  
  // Clean the string (remove whitespace and newlines)
  const cleanedKey = keyString.replace(/\s+/g, '');
  
  // Check if it looks like base64
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  
  if (cleanedKey.length > 0 && cleanedKey.length % 4 === 0 && base64Regex.test(cleanedKey)) {
    try {
      const decoded = Buffer.from(cleanedKey, 'base64').toString('utf8');
      
      // Verify the decoded content looks like an SSH key
      if (decoded.includes('-----BEGIN') || 
          decoded.includes('ssh-rsa') || 
          decoded.includes('ssh-ed25519')) {
        console.log('Successfully decoded base64 SSH key');
        return decoded;
      }
    } catch (error) {
      console.warn('Failed to decode as base64, using key as-is:', error);
    }
  }
  
  return keyString;
};

// Create database configuration
const createPoolConfig = (): any => {
  const poolConfig: any = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : undefined,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 300000, // 5 minutes before an idle client is closed
    allowExitOnIdle: false, // keep Node process alive even when pool is idle
    keepAlive: true, // ensure TCP keep-alives are sent
    keepAliveInitialDelayMillis: 30000, // 30-s delay before first keep-alive packet
    connectionTimeoutMillis: 10000, // Connection timeout
  };

  return poolConfig;
};

// Simple SSH tunnel creation function
const createSimpleSSHTunnel = async () => {
  if (!process.env.SSH_TUNNEL_KEY && !process.env.SSH_KEY_URL) {
    return null;
  }

  const sshKey = process.env.SSH_TUNNEL_KEY || process.env.SSH_KEY_URL;
  if (!sshKey) {
    console.warn('SSH key environment variable is set but empty');
    return null;
  }

  const decodedKey = decodeSSHKey(sshKey);
  
  // Read private key from file or use the key directly
  let privateKey: Buffer;
  try {
    // Try to read as file path first
    privateKey = readFileSync(decodedKey);
  } catch (error) {
    // If reading as file fails, treat it as the key content itself
    privateKey = Buffer.from(decodedKey, 'utf8');
  }

  const tunnelOptions = {
    autoClose: false,
  };

  const serverOptions = {
    host: '127.0.0.1',
    port: 0, // Auto-assign local port
  };

  const sshOptions = {
    host: process.env.SSH_HOST,
    port: parseInt(process.env.SSH_PORT || '22'),
    username: process.env.SSH_USER || 'root',
    privateKey: privateKey,
    passphrase: process.env.SSH_KEY_PASSPHRASE,
    keepaliveInterval: 30000, // Increased from 5s to 30s
    keepaliveCountMax: 3,
    readyTimeout: 30000,
  };

  const forwardOptions = {
    srcAddr: '127.0.0.1',
    srcPort: 0,
    dstAddr: process.env.DB_HOST_REMOTE || process.env.DB_HOST || 'localhost',
    dstPort: parseInt(process.env.DB_PORT_REMOTE || process.env.DB_PORT || '5432'),
  };

  try {
    console.log(`Creating SSH tunnel to ${sshOptions.host}:${sshOptions.port} -> ${forwardOptions.dstAddr}:${forwardOptions.dstPort}`);
    const [server, conn] = await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
    
    const localPort = (server.address() as any)?.port || 0;
    console.log(`SSH tunnel established on local port ${localPort}`);
    
    return { server, conn, localPort };
  } catch (error) {
    console.error('Failed to create SSH tunnel:', error);
    return null;
  }
};

// Function to create pool with optional SSH tunnel
const createPool = async (): Promise<Pool> => {
  const poolConfig = createPoolConfig();
  
  // Try to create SSH tunnel if configured
  const tunnel = await createSimpleSSHTunnel();
  
  if (tunnel) {
    // Use tunnel connection
    poolConfig.host = '127.0.0.1';
    poolConfig.port = tunnel.localPort;
    console.log(`Using SSH tunnel: connecting to database via localhost:${tunnel.localPort}`);
  } else {
    console.log(`Using direct database connection: ${poolConfig.host}:${poolConfig.port}`);
  }

  return new Pool(poolConfig);
};

// Initialize pool
let pool: Pool;
let poolInitialized = false;
let initializationPromise: Promise<void> | null = null;

const initializePool = async (): Promise<void> => {
  // If already initialized, return immediately
  if (poolInitialized) return;
  
  // If initialization is in progress, wait for it to complete
  if (initializationPromise) {
    return initializationPromise;
  }
  
  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log('Initializing database pool...');
      pool = await createPool();
      
      // Handle pool errors
      pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
      });
      
      // Pre-warm the pool so first real request is fast
      await pool.query('SELECT 1');
      console.log('Database pool initialized and warmed successfully');
      
      poolInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database pool:', error);
      // Reset the promise so we can retry
      initializationPromise = null;
      throw error;
    }
  })();
  
  return initializationPromise;
};

// Handle process termination gracefully
const handleShutdown = async (signal: string) => {
  console.log(`Received ${signal}, closing database pool...`);
  try {
    if (pool && poolInitialized) {
      await pool.end();
    }
    console.log('Database pool closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during database pool cleanup:', error);
    process.exit(1);
  }
};

// Only register signal handlers in production or when explicitly requested
if (process.env.NODE_ENV === 'production' || process.env.HANDLE_SIGNALS === 'true') {
  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

// Initialize pool at startup
initializePool().catch((error) => {
  console.error('Failed to initialize database at startup:', error);
  process.exit(1);
});

// Export the pool getter functions
export const getPool = async (): Promise<Pool> => {
  if (!poolInitialized) {
    await initializePool();
  }
  return pool;
};

export const getPoolSync = (): Pool => {
  if (!poolInitialized) {
    throw new Error('Database pool not initialized. Make sure to call getPool() first or wait for initialization.');
  }
  return pool;
};

// For backward compatibility, export default as a proxy that ensures pool is initialized
const poolProxy = new Proxy({} as Pool, {
  get(target, prop) {
    if (!poolInitialized) {
      throw new Error('Database pool not available. The pool may not be initialized yet. Please use getPool() instead.');
    }
    return (pool as any)[prop];
  }
});

export default poolProxy;
