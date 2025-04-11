import { Handle, HandlesResponse } from '@shared/types/handles';

import { apiClient } from './api-client';

export const getHandles = async (): Promise<HandlesResponse> => {
  const response = await apiClient.get<HandlesResponse>('/handles');
  return response.data;
};

export const getHandle = async ({ name }: { name: string }): Promise<Handle> => {
  const { data } = await apiClient.get<Handle>(`/handles/${name}`);

  return data;
};
