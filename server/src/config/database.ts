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
  if (
    keyString.includes('-----BEGIN') ||
    keyString.includes('ssh-rsa') ||
    keyString.includes('ssh-ed25519') ||
    keyString.includes('/') || // likely a file path
    keyString.includes('\\')
  ) {
    // Windows file path
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
      if (
        decoded.includes('-----BEGIN') ||
        decoded.includes('ssh-rsa') ||
        decoded.includes('ssh-ed25519')
      ) {
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
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,

    // Pool settings - back to working values with minor improvements
    max: parseInt(process.env.DB_POOL_MAX || '20'), // Back to reasonable size
    min: parseInt(process.env.DB_POOL_MIN || '5'), // Back to original minimum
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '60000'), // Reduced to 1 minute (was 5 min)
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '8000'), // Conservative 8 seconds
    allowExitOnIdle: false,

    // Query timeouts - moderate increases only
    query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT || '45000'), // 45 seconds (was 30)
    statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '40000'), // 40 seconds (was 25)

    application_name: 'fio-relic-explorer',

    // Basic keep-alive
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,

    // Only include custom options if provided
    ...(process.env.DB_OPTIONS && { options: process.env.DB_OPTIONS }),
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
    privateKey = readFileSync(decodedKey);
  } catch (error) {
    privateKey = Buffer.from(decodedKey, 'utf8');
  }

  const tunnelOptions = { autoClose: false };
  const serverOptions = { host: '127.0.0.1', port: 0 };
  const sshOptions = {
    host: process.env.SSH_HOST,
    port: parseInt(process.env.SSH_PORT || '22'),
    username: process.env.SSH_USER || 'root',
    privateKey: privateKey,
    passphrase: process.env.SSH_KEY_PASSPHRASE,
    keepaliveInterval: 30000,
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
    console.log(
      `Creating SSH tunnel to ${sshOptions.host}:${sshOptions.port} -> ${forwardOptions.dstAddr}:${forwardOptions.dstPort}`
    );
    const [server, conn] = await createTunnel(
      tunnelOptions,
      serverOptions,
      sshOptions,
      forwardOptions
    );

    const localPort = (server.address() as any)?.port || 0;
    console.log(`SSH tunnel established on local port ${localPort}`);

    conn.on('error', (err: Error) => console.error('SSH tunnel connection error:', err));
    conn.on('close', () => console.warn('SSH tunnel connection closed'));
    conn.on('ready', () => console.log('SSH connection ready'));
    server.on('error', (err: Error) => console.error('SSH tunnel server error:', err));

    return { server, conn, localPort };
  } catch (error) {
    console.error('Failed to create SSH tunnel:', error);
    return null;
  }
};

// Function to create pool with optional SSH tunnel
const createPool = async (): Promise<Pool> => {
  const poolConfig = createPoolConfig();

  const tunnel = await createSimpleSSHTunnel();

  if (tunnel) {
    poolConfig.host = '127.0.0.1';
    poolConfig.port = tunnel.localPort;
    poolConfig.connectionTimeoutMillis = parseInt(process.env.DB_CONNECTION_TIMEOUT_SSH || '12000'); // Conservative 12 seconds for SSH tunnel
    console.log(`Using SSH tunnel: connecting to database via localhost:${tunnel.localPort}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
  if (poolInitialized) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      console.log('Initializing database pool...');
      pool = await createPool();

      // Basic pool error handling
      pool.on('error', (err) => {
        console.error('Pool error:', err);
        poolInitialized = false;
        initializationPromise = null;
      });

      // Test initial connection
      const testClient = await pool.connect();
      try {
        await testClient.query('SELECT 1 as test');
        console.log('Database connection test successful');
      } finally {
        testClient.release();
      }

      poolInitialized = true;
      console.log('Database pool initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database pool:', error);
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
};

// Export the pool getter functions
export const getPool = async (): Promise<Pool> => {
  const maxRetries = parseInt(process.env.DB_CONNECTION_RETRIES || '3');
  const retryDelay = parseInt(process.env.DB_RETRY_DELAY || '1000');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!poolInitialized) {
        await initializePool();
      }

      // Simple connection test only
      const testClient = await pool.connect();
      try {
        await testClient.query('SELECT 1');
      } finally {
        testClient.release();
      }

      return pool;
    } catch (error) {
      console.warn(`Pool check failed (attempt ${attempt}/${maxRetries}):`, error);

      if (attempt === maxRetries) {
        throw error;
      }

      poolInitialized = false;
      initializationPromise = null;

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }

  throw new Error('Failed to get database pool after all retries');
};

export const getPoolSync = (): Pool => {
  if (!poolInitialized) {
    throw new Error('Database pool not initialized. Call getPool() first.');
  }
  return pool;
};

// Handle process termination
const handleShutdown = async (signal: string) => {
  console.log(`Received ${signal}, closing database pool...`);
  try {
    if (pool && poolInitialized) {
      await pool.end();
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during pool cleanup:', error);
    process.exit(1);
  }
};

// Register signal handlers
if (process.env.NODE_ENV === 'production' || process.env.HANDLE_SIGNALS === 'true') {
  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

// Initialize pool at startup
initializePool().catch((error: any) => {
  console.error('Failed to initialize database at startup:', error);
  process.exit(1);
});

// Enhanced pool proxy for backward compatibility
class EnhancedPoolProxy {
  async query(text: string, params?: any[]): Promise<any>;
  async query(config: any): Promise<any>;
  async query(textOrConfig: string | any, params?: any[]): Promise<any> {
    const pool = await getPool();
    if (typeof textOrConfig === 'string') {
      return pool.query(textOrConfig, params);
    } else {
      return pool.query(textOrConfig);
    }
  }

  async connect() {
    const pool = await getPool();
    return pool.connect();
  }

  async end() {
    const pool = await getPool();
    return pool.end();
  }

  on(event: 'error' | 'connect' | 'acquire' | 'remove' | 'release', listener: any) {
    if (!poolInitialized) {
      throw new Error('Database pool not available.');
    }
    return pool.on(event as any, listener);
  }

  get totalCount() {
    if (!poolInitialized) {
      throw new Error('Database pool not available.');
    }
    return pool.totalCount;
  }

  get idleCount() {
    if (!poolInitialized) {
      throw new Error('Database pool not available.');
    }
    return pool.idleCount;
  }

  get waitingCount() {
    if (!poolInitialized) {
      throw new Error('Database pool not available.');
    }
    return pool.waitingCount;
  }
}

export default new EnhancedPoolProxy();
