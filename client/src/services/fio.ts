import axios from 'axios';

import { NODE_URLS } from '@shared/constants/fio';

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
  const response = await axios.get(`${NODE_URLS[0]}chain/get_info`);

  return response.data;
};
