import { PubAddress } from "./pub-address";

export interface Handle {
  pk_handle_id: number;
  handle: string;
  encryption_key: string;
  is_encrypt_key_set: boolean;
  bundled_tx_count?: number;
  expiration_stamp: string;
  block_timestamp?: string;
  handle_status: 'active' | 'burnt';
  owner_account_name: string;
  owner_account_id: string;
  domain_name: string;
}

export interface HandleChainData {
  owner_account: string;
  bundleeligiblecountdown: number;
  addresses: PubAddress[];
}

export interface HandleNFT {
  url: string;
}

export interface HandleTransaction {
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

export interface HandlesResponse {
  data: Handle[];
  total: number;
  all: number;
  active: number;
}

export interface HandleResponse {
  handle: Handle;
  chainData: HandleChainData;
}

export interface HandleTransactionsResponse {
  transactions: HandleTransaction[];
  total: number;
}
