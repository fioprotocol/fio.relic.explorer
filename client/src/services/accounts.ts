import { apiClient } from './api-client';
import { AccountsResponse, AccountSortOption, AccountResponse } from '@shared/types/accounts';

export const getAccounts = async (params: {
  offset: number;
  limit: number;
  order?: 'asc' | 'desc';
  sort?: AccountSortOption;
}): Promise<AccountsResponse> => {
  const response = await apiClient.get<AccountsResponse>('/accounts', { params });
  return response.data;
};

export const getAccount = async ({ account }: { account: string }): Promise<AccountResponse> => {
  const response = await apiClient.get<AccountResponse>(`/accounts/${account}`);
  return response.data;
};
