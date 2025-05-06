import { apiClient } from './api-client';
import {
  AccountsResponse,
  AccountSortOption,
  AccountResponse,
  AccountTransactionsResponse,
  AccountFioHandlesResponse,
} from '@shared/types/accounts';

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

export const getAccountTransactions = async ({
  account,
}: {
  account: string;
}): Promise<AccountTransactionsResponse> => {
  const response = await apiClient.get<AccountTransactionsResponse>(
    `/accounts/${account}/transactions`
  );
  return response.data;
};

export const getAccountFioHandles = async ({
  account,
}: {
  account: string;
}): Promise<AccountFioHandlesResponse> => {
  const response = await apiClient.get<AccountFioHandlesResponse>(`/accounts/${account}/fio-handles`);
  return response.data;
};
