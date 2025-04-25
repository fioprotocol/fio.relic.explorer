import { apiClient } from './api-client';
import { AccountsResponse, AccountSortOption } from '@shared/types/accounts';

export const getAccounts = async (params: {
  offset: number;
  limit: number;
  order?: 'asc' | 'desc';
  sort?: AccountSortOption;
}): Promise<AccountsResponse> => {
  const response = await apiClient.get<AccountsResponse>('/accounts', { params });
  return response.data;
}; 
