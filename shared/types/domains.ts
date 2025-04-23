import { Handle } from './handles';

export interface Domain {
  pk_domain_id: number;
  domain_name: string;
  is_public: boolean;
  expiration_timestamp: string;
  domain_status: string;
  owner_account_name: string;
  owner_account_id: number;
  handle_count: number;
}

export interface DomainChainData {
  owner_account: string;
}

export interface DomainResponse {
  domain: Domain;
  chainData: DomainChainData;
}

export type DomainSortOption =
  | 'pk_domain_id'
  | 'domain_name'
  | 'expiration_timestamp'
  | 'handle_count';

export interface DomainsResponse {
  data: Domain[];
  total: number;
  all: number;
  active: number;
}

export interface DomainTransaction {
  pk_handle_activity_id: number;
  handle_activity_type: string;
  block_timestamp: string;
  transaction_id: string;
  action_name: string;
  tpid: string;
  fee: string;
  result_status: string;
  account_name: string;
}

export interface DomainTransactionsResponse {
  transactions: DomainTransaction[];
  total: number;
}

export interface DomainHandlesResponse {
  handles: Handle[];
  total: number;
}
