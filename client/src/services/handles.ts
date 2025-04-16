import { apiClient } from './api-client';

import { Handle, HandlesResponse, HandleTransactionsResponse } from '@shared/types/handles';

export const getHandles = async (params: {
  offset: number;
  limit: number;
}): Promise<HandlesResponse> => {
  const response = await apiClient.get<HandlesResponse>('/handles', { params });
  return response.data;
};

export const getHandle = async ({ handle }: { handle: string }): Promise<Handle> => {
  const { data } = await apiClient.get<Handle>(`/handles/${handle}`);

  return data;
};

export const getHandleTransactions = async ({
  handle,
  offset,
  limit,
}: {
  handle: string;
  offset?: number;
  limit?: number;
}): Promise<HandleTransactionsResponse> => {
  const { data } = await apiClient.get<HandleTransactionsResponse>(
    `/handles/${handle}/transactions`,
    { params: { offset, limit } }
  );

  return data;
};
