import { Block, BlocksResponse, CurrentBlockResponse } from '@shared/types/blocks';

import { apiClient } from './api-client';

export const getBlocks = async (): Promise<BlocksResponse> => {
  const response = await apiClient.get<BlocksResponse>('/blocks');
  return response.data;
};

export const getCurrent = async (): Promise<Block> => {
  const { data } = await apiClient.get<CurrentBlockResponse>('/current-block');

  return data.data;
};
