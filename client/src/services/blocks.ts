import axios from 'axios';
import { API_PREFIX } from '@shared/constants/network';
import { BlocksResponse, CurrentBlockResponse } from '@shared/types/blocks';

export const getBlocks = async (): Promise<BlocksResponse> => {
  const response = await axios.get<BlocksResponse>(`${API_PREFIX}/blocks`);
  return response.data;
};

export const getCurrent = async (): Promise<CurrentBlockResponse> => {
  const response = await axios.get<CurrentBlockResponse>(`${API_PREFIX}/current-block`);
  return response.data;
};
