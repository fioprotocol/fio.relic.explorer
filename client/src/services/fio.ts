import axios from 'axios';

import { FIO_CONTRACTS_MAP, NODE_URLS, FIO_API_VERSION } from '@shared/constants/fio';

import {
  BlockProducerResponse,
  ContractTableRow,
  ContractTablesResponse,
  FioChainProducer,
  FioChainVoter,
  GetTableRowsResponse,
  TransactionHistoryResponse,
} from '@shared/types/fio-api-server';
import { HandleNFT } from '@shared/types/handles';
import { getTableRows } from '@shared/util/fio';
import { AnyObject } from '@shared/types/general';

const FIO_DASH_API_URL = 'https://app.fio.net/api/v1';

export interface ChainInfo {
  last_irreversible_block_num: number;
  chain_id: string;
}

export const fetchPrice = async (): Promise<string> => {
  try {
    const response = await axios.get(`${FIO_DASH_API_URL}/reg/prices?actual=false`);

    return response.data?.data?.pricing?.usdtRoe || '';
  } catch (err) {
    console.error(err);

    return '';
  }
};

export const getInfo = async (): Promise<ChainInfo> => {
  const response = await axios.get<ChainInfo>(`${NODE_URLS[0]}${FIO_API_VERSION}/chain/get_info`);

  return response.data;
};

export const getTransactionHistoryData = async ({
  id,
}: {
  id: string;
}): Promise<TransactionHistoryResponse> => {
  const response = await axios.post<TransactionHistoryResponse>(
    `${NODE_URLS[0]}${FIO_API_VERSION}/history/get_transaction`,
    {
      id,
    }
  );

  return response.data;
};

export const getBlockProducers = async (): Promise<BlockProducerResponse> => {
  const response = await axios.post<BlockProducerResponse>(`${NODE_URLS[0]}${FIO_API_VERSION}/chain/get_producers`);

  return response.data;
};

export const getSignedNFTs = async ({
  fch,
  limit,
  offset,
}: {
  fch: string;
  limit: number;
  offset: number;
}): Promise<{ nfts: HandleNFT[]; more: number }> => {
  const response = await axios.post(`${NODE_URLS[0]}${FIO_API_VERSION}/chain/get_nfts_fio_address`, {
    fio_address: fch,
    limit,
    offset,
  });

  return response.data;
};

export const getNftMetadata = async ({
  chainName,
  tokenAddress,
  tokenId,
}: {
  chainName: string;
  tokenAddress: string;
  tokenId: string;
}): Promise<{
  token_address: string;
  token_id: string;
  amount: string;
  owner_of: string;
  token_hash: string;
  block_number_minted: string;
  block_number: string;
  transfer_index: number[];
  contract_type: string;
  name: string;
  symbol: string;
  token_uri: string;
  metadata: string | null;
  last_token_uri_sync: string;
  last_metadata_sync: string;
  minter_address: string;
  normalized_metadata: {
    name: string;
    description: string;
    animation_url: string | null;
    external_link: string | null;
    image: string;
    attributes: {
      trait_type: string | null;
      value: string | null;
      display_type: string | null;
      max_value: string | null;
      trait_count: number | null;
      order: string | null;
    }[];
  } | null;
  possible_spam: boolean;
  verified_collection: boolean;
} | null> => {
  try {
    const response = await axios.get(`${FIO_DASH_API_URL}/external-provider-nfts-metadata`, {
      params: { chainName, tokenAddress, tokenId },
    });

    return response.data;
  } catch (err) {
    console.error(err);

    return null;
  }
};

export const getUrlContent = async (url: string): Promise<string | null> => {
  const response = await axios.get(`${FIO_DASH_API_URL}/get-url-content`, { params: { url } });

  return response.data;
};

export const getContractTables = async ({
  contractName,
}: {
  contractName: string;
}): Promise<ContractTablesResponse> => {
  if (!contractName) {
    return { contractName: '', tables: [] };
  }

  const response = await axios.post(`${NODE_URLS[0]}${FIO_API_VERSION}/chain/get_abi`, {
    account_name: contractName,
  });

  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = response.data;

  if (!data.abi) {
    throw new Error('No ABI found for this contract.');
  }

  return { contractName, tables: data.abi.tables };
};

export const getContractScopeInfo = async ({
  contractName,
  tableName,
  limit = 20,
  offset = 0,
}: {
  contractName: string;
  tableName: string;
  limit?: number;
  offset?: number;
}): Promise<{ scopes: string[]; more: number }> => {
  if (!contractName || !tableName) {
    throw new Error('Contract name and table name is required');
  }

  const scopesResponse = await axios.post(`${NODE_URLS[0]}${FIO_API_VERSION}/chain/get_table_by_scope`, {
    code: contractName,
    table: tableName,
    limit,
    offset,
  });

  if (scopesResponse.status !== 200) {
    throw new Error(`HTTP error! status: ${scopesResponse.status}`);
  }

  const scopesData = scopesResponse.data;

  return {
    scopes: scopesData.rows.map((row: { scope: string }) => row.scope),
    more: scopesData.more,
  };
};

export const getTableInfo = async ({
  contractName,
  tableName,
  scope,
  limit,
  upper_bound,
  lower_bound,
  reverse,
}: {
  contractName: string;
  tableName: string;
  scope?: string;
  limit: number;
  lower_bound?: number | string;
  upper_bound?: number | string;
  reverse?: boolean;
}): Promise<{ rows: ContractTableRow[]; more: number }> => {
  if (!contractName || !tableName) {
    throw new Error('Contract name and table name is required');
  }

  // If no scopes found, try with contract name as scope
  if (!scope) {
    scope = contractName;
  }

  let allRows: ContractTableRow[] = [];

  const tableResponse = await axios.post(`${NODE_URLS[0]}${FIO_API_VERSION}/chain/get_table_rows`, {
    code: contractName,
    scope: scope,
    table: tableName,
    limit,
    lower_bound,
    upper_bound,
    json: true,
    reverse,
  });

  if (tableResponse.status !== 200) {
    console.error(`Error fetching scope ${scope}: ${tableResponse.statusText}`);
    throw new Error(`HTTP error! status: ${tableResponse.status}`);
  }

  const tableData = tableResponse.data;

  // Add scope info to each row
  const scopeRows = tableData.rows.map((row: ContractTableRow) => ({
    ...row,
  }));

  allRows = [...allRows, ...scopeRows];

  return { rows: allRows, more: tableResponse.data.more };
};

export const getProducersFromFioChain = async ({
  accountName,
}: {
  accountName: string;
}): Promise<GetTableRowsResponse<FioChainProducer>> => {
  const params = {
    json: true,
    code: FIO_CONTRACTS_MAP.eosio,
    scope: FIO_CONTRACTS_MAP.eosio,
    table: 'producers',
    lower_bound: accountName,
    upper_bound: accountName,
    index_position: '4',
    key_type: 'name',
  };
  return await getTableRows(params);
};

export const getVotersFromFioChain = async ({
  accountName,
}: {
  accountName: string;
}): Promise<GetTableRowsResponse<FioChainVoter>> => {
  const params = {
    json: true,
    code: FIO_CONTRACTS_MAP.eosio,
    scope: FIO_CONTRACTS_MAP.eosio,
    table: 'voters',
    lower_bound: accountName,
    upper_bound: accountName,
    index_position: '3',
    key_type: 'name',
  };

  return await getTableRows<FioChainVoter>(params);
};

export const getProxyVotesData = async ({ accountName }: { accountName: string }): Promise<{
  producers: GetTableRowsResponse<FioChainProducer>;
  voters: GetTableRowsResponse<FioChainVoter>;
}> => {
  const producers = await getProducersFromFioChain({ accountName });
  const voters = await getVotersFromFioChain({ accountName });

  return {
    producers,
    voters,
  };
};

export type FioBalanceResponse = {
  balance: number;
  available: number;
  staked: number;
  srps: number;
  roe: string;
};

export const getFioBalance = async ({ fioPublicKey }: { fioPublicKey: string }): Promise<FioBalanceResponse> => {
  const response = await axios.post<FioBalanceResponse>(`${NODE_URLS[0]}${FIO_API_VERSION}/chain/get_fio_balance`, {
    fio_public_key: fioPublicKey,
  });

  return response.data;
};

export type FioAccountPermission = {
  perm_name: string;
  parent: string;
  required_auth: {
    threshold: number;
    keys: {
      key: string;
      weight: number;
    }[];
    accounts: AnyObject[];
    waits: AnyObject[];
  };
};

export type FioAccountResponse = {
  account_name: string;
  head_block_num: number;
  head_block_time: string;
  privileged: boolean;
  last_code_update: string;
  created: string;
  ram_quota: number;
  net_weight: number;
  cpu_weight: number;
  net_limit: {
    used: number;
    available: number;
    max: number;
  };
  cpu_limit: {
    used: number;
    available: number;
    max: number;
  };
  ram_usage: number;
  permissions: FioAccountPermission[];
  total_resources: {
    owner: string;
    net_weight: string;
    cpu_weight: string;
    ram_bytes: number;
  };
  self_delegated_bandwidth: AnyObject;
  refund_request: AnyObject;
  voter_info: AnyObject;
};

export const getAccountKeyPermissions = async ({
  accountName,
}: {
  accountName: string;
}): Promise<FioAccountResponse> => {
  const response = await axios.post<FioAccountResponse>(`${NODE_URLS[0]}${FIO_API_VERSION}/chain/get_account`, {
    account_name: accountName,
  });

  return response.data;
};

export const getAccountPublicKey = async ({ accountName }: { accountName: string }): Promise<{ fio_public_key: string }> => {
  const response = await axios.post(`${NODE_URLS[0]}${FIO_API_VERSION}/chain/get_account_fio_public_key`, {
    account: accountName,
  });

  return response.data;
};
