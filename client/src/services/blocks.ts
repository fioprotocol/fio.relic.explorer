import { Block, BlocksResponse, CurrentBlockResponse } from '@shared/types/blocks';

import { apiClient } from './api-client';

export const getBlocks = async (params: { offset: number, limit: number }): Promise<BlocksResponse> => {
  const response = await apiClient.get<BlocksResponse>('/blocks', { params });
  return response.data;
};

export const getCurrent = async (): Promise<Block> => {
  const { data } = await apiClient.get<CurrentBlockResponse>('/current-block');

  return data.data;
};

export const getBlock = async ({ block_number }: { block_number: number }): Promise<Block> => {
  const { data } = await apiClient.get<CurrentBlockResponse>(`/blocks/${block_number}`);

  return data.data;
};
