import { apiClient } from './api-client';
import {
  CursorAccountsResponse,
  AccountSortOption,
  AccountResponse,
  CursorAccountTransactionsResponse,
  CursorAccountFioHandlesResponse,
  CursorAccountDomainsResponse,
} from '@shared/types/accounts';
import { PaginationDirection } from '@shared/constants/pagination';

export const getAccounts = async (params: {
  cursor?: string | null;
  direction?: PaginationDirection;
  limit?: number;
  order?: 'asc' | 'desc';
  sort?: AccountSortOption;
  include_total?: boolean;
}): Promise<CursorAccountsResponse> => {
  const response = await apiClient.get<CursorAccountsResponse>('/accounts', {
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
  cursor,
  direction,
}: {
  account: string;
  limit?: number;
  cursor?: string;
  direction?: PaginationDirection;
}): Promise<CursorAccountTransactionsResponse> => {
  const response = await apiClient.get<CursorAccountTransactionsResponse>(
    `/accounts/${account}/transactions`,
    { params: { limit, cursor, direction } }
  );
  return response.data;
};

export const getAccountFioHandles = async ({
  account,
  limit,
  cursor,
  direction,
}: {
  account: string;
  limit?: number;
  cursor?: string;
  direction?: PaginationDirection;
}): Promise<CursorAccountFioHandlesResponse> => {
  const response = await apiClient.get<CursorAccountFioHandlesResponse>(
    `/accounts/${account}/fio-handles`,
    { params: { limit, cursor, direction } }
  );
  return response.data;
};

export const getAccountDomains = async ({
  account,
  limit,
  cursor,
  direction,
}: {
  account: string;
  limit?: number;
  cursor?: string;
  direction?: PaginationDirection;
}): Promise<CursorAccountDomainsResponse> => {
  const response = await apiClient.get<CursorAccountDomainsResponse>(
    `/accounts/${account}/domains`,
    { params: { limit, cursor, direction } }
  );
  return response.data;
};
