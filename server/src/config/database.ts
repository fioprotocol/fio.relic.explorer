import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a new PostgreSQL connection pool
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
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
};

// Add SSH configuration if SSH key URL is provided
if (process.env.SSH_KEY_URL) {
  poolConfig.ssh = {
    host: process.env.SSH_HOST,
    port: parseInt(process.env.SSH_PORT || '22'),
    username: process.env.SSH_USER,
    privateKey: process.env.SSH_KEY_URL,
    passphrase: process.env.SSH_KEY_PASSPHRASE, // Optional if your key requires a passphrase
  };
}

const pool = new Pool(poolConfig);

// Test the connection
pool.connect()
  .then(client => {
    console.log('Successfully connected to PostgreSQL database');
    client.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

export default pool;
