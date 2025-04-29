import axios from 'axios';

import { NODE_URLS } from '@shared/constants/fio';
import {
  BlockProducerResponse,
  ContractTableRow,
  ContractTablesResponse,
  TransactionHistoryResponse,
} from '@shared/types/fio-api-server';
import { HandleNFT } from '@shared/types/handles';

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
  const response = await axios.get<ChainInfo>(`${NODE_URLS[0]}chain/get_info`);

  return response.data;
};

export const getTransactionHistoryData = async ({
  id,
}: {
  id: string;
}): Promise<TransactionHistoryResponse> => {
  const response = await axios.post<TransactionHistoryResponse>(
    `${NODE_URLS[0]}history/get_transaction`,
    {
      id,
    }
  );

  return response.data;
};

export const getBlockProducers = async (): Promise<BlockProducerResponse> => {
  const response = await axios.post<BlockProducerResponse>(`${NODE_URLS[0]}chain/get_producers`);

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
  const response = await axios.post(`${NODE_URLS[0]}chain/get_nfts_fio_address`, {
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

  const response = await axios.post(`${NODE_URLS[0]}chain/get_abi`, {
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
    return { scopes: [], more: 0 };
  }

  const scopesResponse = await axios.post(`${NODE_URLS[0]}chain/get_table_by_scope`, {
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
    return { rows: [], more: 0 };
  }

  // If no scopes found, try with contract name as scope
  if (!scope) {
    scope = contractName;
  }

  let allRows: ContractTableRow[] = [];

  const tableResponse = await axios.post(`${NODE_URLS[0]}chain/get_table_rows`, {
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
    return { rows: [], more: 0 };
  }

  const tableData = tableResponse.data;

  // Add scope info to each row
  const scopeRows = tableData.rows.map((row: ContractTableRow) => ({
    ...row,
  }));

  allRows = [...allRows, ...scopeRows];

  return { rows: allRows, more: tableResponse.data.more };
};
