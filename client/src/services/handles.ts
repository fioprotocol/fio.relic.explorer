import { apiClient } from './api-client';

import { Handle, HandlesResponse, HandleTransaction } from '@shared/types/handles';

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
}: {
  handle: string;
}): Promise<HandleTransaction[]> => {
  const { data } = await apiClient.get<HandleTransaction[]>(`/handles/${handle}/transactions`);

  return data;
};
