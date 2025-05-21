import { apiClient } from './api-client';
import {
  AccountsResponse,
  AccountSortOption,
  AccountResponse,
  AccountTransactionsResponse,
  AccountFioHandlesResponse,
  AccountDomainResponse,
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
  limit,
  offset,
}: {
  account: string;
  limit: number;
  offset: number;
}): Promise<AccountTransactionsResponse> => {
  const response = await apiClient.get<AccountTransactionsResponse>(
    `/accounts/${account}/transactions`,
    { params: { limit, offset } }
  );
  return response.data;
};

export const getAccountFioHandles = async ({
  account,
  limit,
  offset,
}: {
  account: string;
  limit: number;
  offset: number;
}): Promise<AccountFioHandlesResponse> => {
  const response = await apiClient.get<AccountFioHandlesResponse>(`/accounts/${account}/fio-handles`,
    { params: { limit, offset } }
  );
  return response.data;
};

export const getAccountDomains = async ({
  account,
  limit,
  offset,
}: {
  account: string;
  limit: number;
  offset: number;
}): Promise<AccountDomainResponse> => {
  const response = await apiClient.get<AccountDomainResponse>(`/accounts/${account}/domains`,
    { params: { limit, offset } }
  );
  return response.data;
};
