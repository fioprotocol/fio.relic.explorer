import {
  Block,
  BlocksResponse,
  CurrentBlockResponse,
  BlockResponse,
  BlockResponseData,
  BlocksDateResponse,
} from '@shared/types/blocks';

import { apiClient } from './api-client';

export const getBlocks = async (params: {
  offset: number;
  limit: number;
}): Promise<BlocksResponse> => {
  const response = await apiClient.get<BlocksResponse>('/blocks', { params });
  return response.data;
};

export const getCurrent = async (): Promise<Block> => {
  const { data } = await apiClient.get<CurrentBlockResponse>('/blocks/current');

  return data.data;
};

export const getBlock = async ({
  block_number,
}: {
  block_number: number;
}): Promise<BlockResponseData> => {
  const { data } = await apiClient.get<BlockResponse>(`/blocks/${block_number}`);

  return data.data;
};

export const getBlocksDate = async (params: { blocks: string[] }): Promise<BlocksDateResponse> => {
  const { data } = await apiClient.get<BlocksDateResponse>('/blocks/date', { params });

  return data;
};
