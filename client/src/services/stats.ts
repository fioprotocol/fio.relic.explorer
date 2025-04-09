import { StatsResponse } from '@shared/types/stats';
import { apiClient } from './api-client';

export const getStats = async (days: number): Promise<StatsResponse> => {
  const response = await apiClient.get<StatsResponse>(`/stats`, {
    params: { days }
  });
  return response.data;
};
