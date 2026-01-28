import {
  Block,
  CurrentBlockResponse,
  BlockResponse,
  BlockResponseData,
  BlocksDateResponse,
  CursorBlocksResponse,
} from '@shared/types/blocks';

import { apiClient } from './api-client';
import { PaginationDirection } from '@shared/constants/pagination';

export const getBlocks = async (params: {
  cursor?: string;
  direction?: PaginationDirection;
  limit?: number;
}): Promise<CursorBlocksResponse> => {
  const { data } = await apiClient.get<CursorBlocksResponse>('/blocks', { params });
  return data;
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
