import { apiClient } from './api-client';
import {
  AccountsResponse,
  CursorAccountsResponse,
  AccountSortOption,
  AccountResponse,
  AccountTransactionsResponse,
  AccountFioHandlesResponse,
  AccountDomainResponse,
} from '@shared/types/accounts';
import { PaginationDirection } from '@shared/constants/pagination';

export const getAccounts = async (params: {
  cursor?: string | null;
  direction?: PaginationDirection;
  limit?: number;
  order?: 'asc' | 'desc';
  sort?: AccountSortOption;
  include_total?: boolean;
}): Promise<CursorAccountsResponse | AccountsResponse> => {
  const response = await apiClient.get<CursorAccountsResponse | AccountsResponse>('/accounts', {
    params,
  });
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
  const response = await apiClient.get<AccountFioHandlesResponse>(
    `/accounts/${account}/fio-handles`,
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
  const response = await apiClient.get<AccountDomainResponse>(`/accounts/${account}/domains`, {
    params: { limit, offset },
  });
  return response.data;
};
