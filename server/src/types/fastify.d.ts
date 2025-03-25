import { FastifyInstance } from 'fastify'
import { Pool, PoolClient } from 'pg'

declare module 'fastify' {
  interface FastifyInstance {
    pg: {
      connect: () => Promise<PoolClient>;
      pool: Pool;
      query: Pool['query'];
    }
  }
  
  interface FastifySchema {
    tags?: string[];
    summary?: string;
    description?: string;
  }
} 