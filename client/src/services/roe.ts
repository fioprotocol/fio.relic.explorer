import { ROEResponse } from '@shared/types/roe';
import { apiClient } from './api-client';

export const getROE = async (): Promise<string> => {
  try {
    const { data } = await apiClient.get<ROEResponse>('/roe');
    return data.data?.roe;
  } catch (error) {
    console.error('Error fetching ROE:', error);
    return 'N/A';
  }
};
