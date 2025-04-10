import axios from 'axios';

export interface ChainInfo {
  last_irreversible_block_num: number;
}

export const getInfo = async (): Promise<ChainInfo> => {
  const response = await axios.get(`https://fio.eosusa.io/v1/chain/get_info`);

  return response.data;
};
