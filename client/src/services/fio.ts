import axios from 'axios';

import { NODE_URLS } from '@shared/constants/fio';
import { BlockProducerResponse, TransactionHistoryResponse } from '@shared/types/fio-api-server';

export interface ChainInfo {
  last_irreversible_block_num: number;
  chain_id: string;
}

export const fetchPrice = async (): Promise<string> => {
  try {
    const response = await axios.get('https://app.fio.net/api/v1/reg/prices?actual=false');

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

export const getTransactionHistoryData = async ({ id }: { id: string }): Promise<TransactionHistoryResponse> => {
  const response = await axios.post<TransactionHistoryResponse>(`${NODE_URLS[0]}history/get_transaction`, {
    id,
  });

  return response.data;
};

export const getBlockProducers = async (): Promise<BlockProducerResponse> => {
  const response = await axios.post<BlockProducerResponse>(`${NODE_URLS[0]}chain/get_producers`);

  return response.data;
};
