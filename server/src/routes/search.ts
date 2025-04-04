import { FastifyPluginAsync, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';
import { Ecc } from '@fioprotocol/fiojs';

import pool from '../config/database';

import { SearchResponse, SearchResultType } from 'shared/types/search';

// Define the query interface
interface SearchQuery {
  Querystring: {
    q: string;
  };
}

const INVALID_QUERY_ERR_CODE = 'INVALID_QUERY';

const queryByType: Record<SearchResultType, string> = {
  publicKey: `
    SELECT * FROM pubaddresses 
    WHERE pub_address = $1
    LIMIT 1
  `,
  handle: `
    SELECT * FROM handles 
    WHERE handle = $1
    LIMIT 1
  `,
  account: `
    SELECT * FROM accounts 
    WHERE account_name = $1
    LIMIT 1
  `,
  domain: `
    SELECT * FROM domains 
    WHERE domain_name = $1
    LIMIT 1
  `,
  tx: `
    SELECT * FROM transactions 
    WHERE transaction_id = $1
    LIMIT 1
  `,
};

const validateType = (q: string): SearchResultType => {
  // Validation patterns
  const isFioPublicAddress = /^FIO[a-zA-Z0-9]{42,}$/i.test(q) && Ecc.PublicKey.isValid(q);
  // const isFioHandle = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/i.test(q);
  const isFioHandle =
    /^(?=.{3,64}$)[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?@[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$/gim.test(
      q
    );
  const isAccount =
    /^[a-zA-Z]{12}$/.test(q) ||
    [
      'eosio',
      'eosio.msig',
      'eosio.token',
      'fio.address',
      'fio.fee',
      'fio.token',
      'fio.treasury',
      'fio.whitelst',
    ].includes(q);
  const isDomain = /^(?!-)[a-zA-Z0-9-]{1,62}(?<!-)$/.test(q);
  const isTransactionId = /^[a-f0-9]{64}$/.test(q);

  if (isFioPublicAddress) {
    return 'publicKey';
  }
  if (isFioHandle) {
    return 'handle';
  }
  if (isAccount) {
    return 'account';
  }
  if (isDomain) {
    return 'domain';
  }
  if (isTransactionId) {
    return 'tx';
  }

  throw new Error(INVALID_QUERY_ERR_CODE);
};

const searchRoute: FastifyPluginAsync = async (fastify) => {
  // Cast instance to use the type provider
  const server = fastify.withTypeProvider();

  // Search endpoint
  const getSearchOpts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string', maxLength: 64 },
        },
        required: ['q'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: {
                    type: 'string',
                    enum: ['account', 'tx', 'domain', 'handle', 'publicKey'],
                  },
                  title: { type: 'string' },
                  data: { type: 'object', additionalProperties: true },
                },
              },
            },
            totalCount: { type: 'number' },
            page: { type: 'number' },
            pageSize: { type: 'number' },
          },
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
      tags: ['search'],
      summary: 'Search for data',
      description: 'Search for accounts, transactions, domains, handles, and public keys',
    },
  };

  server.get<SearchQuery>(
    '/',
    getSearchOpts,
    async (request: FastifyRequest<SearchQuery>, reply: FastifyReply): Promise<SearchResponse> => {
      const { q } = request.query;

      try {
        let params = [q];
        let type: SearchResultType = validateType(q);
        let sqlQuery = queryByType[type];

        const result = await pool.query(sqlQuery, params);
        console.log('Search results:', result);

        // Format response based on the type of search
        return {
          results: result.rows.map((row) => ({
            id: row.id || row.transaction_id || row.domain_name || row.account_name || row.handle,
            type,
            title: '',
            data: row,
          })),
          totalCount: result.rowCount || 0,
          page: 1,
          pageSize: 10,
        };
      } catch (error) {
        if (error instanceof Error && error.message === INVALID_QUERY_ERR_CODE) {
          return reply.status(400).send({
            error:
              'Invalid search query. Please provide a valid FIO Public Address, FIO Handle, Account, Domain, or Transaction ID.',
          });
        }

        console.error('Search error:', error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );
};

export default searchRoute;
