import axios from 'axios';
import { API_PREFIX } from '@shared/constants/network';
import { StatsResponse } from '@shared/types/stats';

export const getStats = async (days: number): Promise<StatsResponse> => {
  const response = await axios.get<StatsResponse>(`${API_PREFIX}/stats?days=${days}`);
  return response.data;
};
