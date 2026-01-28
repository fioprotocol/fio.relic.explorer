import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const devEnv = 'development';

// Configuration object with typed environment variables
interface Config {
  server: {
    port: number;
    host: string;
    nodeEnv: string;
    clientUrl: string;
  };
  isDev: boolean;
}

// Default values and environment variable parsing
const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '9090', 10),
    host: '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || devEnv,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  },
  isDev: process.env.NODE_ENV === devEnv,
};

export default config;
