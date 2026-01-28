import { StatsResponse } from '@shared/types/stats';
import { apiClient } from './api-client';

export const getStats = async ({ days, useLastRecord }: { days: number, useLastRecord: boolean }): Promise<StatsResponse> => {
  const response = await apiClient.get<StatsResponse>(`/stats`, {
    params: { days, useLastRecord }
  });
  return response.data;
};
