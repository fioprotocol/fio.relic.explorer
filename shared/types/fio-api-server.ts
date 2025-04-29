import { AnyObject } from './general';

export type ChainInfoResponse = {
  server_version: string;
  chain_id: string;
  head_block_num: number;
  last_irreversible_block_num: number;
  last_irreversible_block_id: string;
  head_block_id: string;
  head_block_time: string; // ISO date string format
  head_block_producer: string;
  virtual_block_cpu_limit: number;
  virtual_block_net_limit: number;
  block_cpu_limit: number;
  block_net_limit: number;
  server_version_string: string;
  fork_db_head_block_num: number;
  fork_db_head_block_id: string;
};

export type TransactionHistoryResponse = {
  id: string;
  trx: {
    receipt: {
      status: string;
      cpu_usage_us: number;
      net_usage_words: number;
      trx: [
        number,
        {
          signatures: string;
          compression: string;
          packed_context_free_data: string;
          packed_trx: string;
        },
      ];
    };
    trx: {
      expiration: string;
      ref_block_num: number;
      ref_block_prefix: number;
      max_net_usage_words: number;
      max_cpu_usage_ms: number;
      delay_sec: number;
      context_free_actions: AnyObject[];
      actions: AnyObject[];
      transaction_extensions: AnyObject[];
      signatures: string[];
      context_free_data: AnyObject[];
    };
  };
  block_num: number;
  block_time: string;
  last_irreversible_block: number;
  traces: Array<{
    receipt: {
      receiver: string;
      global_sequence: string;
      recv_sequence: string;
      auth_sequence: Array<{
        account: string;
        sequence: string;
      }>;
    };
    act: {
      account: string;
      name: string;
      authorization: Array<{
        actor: string;
        permission: string;
      }>;
      data: AnyObject;
    };
    account_ram_deltas: Array<{
      account: string;
      delta: string;
    }>;
    context_free: boolean;
    block_num: number;
    block_time: string;
    console: string;
    elapsed: number;
    except: null | AnyObject;
    inline_traces: AnyObject[];
    producer_block_id: string;
    trx_id: string;
  }>;
  query_time_ms: number;
  last_indexed_block: number;
  last_indexed_block_time: string;
};

export type BlockProducer = {
  addresshash: string;
  fio_address: string;
  id: number;
  is_active: number;
  last_bpclaim: number;
  last_claim_time: string;
  location: number;
  owner: string;
  producer_public_key: string;
  total_votes: string;
  unpaid_blocks: number;
  url: string;
};

export type BlockProducerResponse = {
  more: boolean;
  producers: BlockProducer[];
  total_producer_vote_weight: string;
};

export type ContractTable = { name: string; type: string; key_names: string[] };
export type ContractItemType = { name: string; tables: ContractTable[] };
export type ContractTableRow = AnyObject; // could be a lot of different objects
export type ContractTablesResponse = {
  contractName: string;
  tables: ContractTable[];
};
export type ContractScopeResponse = {
  scopes: string[];
  more: number;
};
