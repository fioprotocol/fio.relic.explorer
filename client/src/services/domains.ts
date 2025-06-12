import { apiClient } from './api-client';

import {
  Domain,
  DomainsResponse,
  CursorDomainsResponse,
  DomainTransactionsResponse,
  DomainSortOption,
} from '@shared/types/domains';
import { Handle } from '@shared/types/handles';
import { PaginationDirection } from '@shared/constants/pagination';

export async function getDomains(params: {
  cursor?: string;
  direction?: PaginationDirection;
  limit?: number;
  order?: 'asc' | 'desc';
  sort?: DomainSortOption;
  only_public?: boolean;
  include_total?: boolean;
}): Promise<DomainsResponse | CursorDomainsResponse> {
  const response = await apiClient.get<DomainsResponse | CursorDomainsResponse>('/domains', {
    params,
  });
  return response.data;
}

export const getDomain = async ({ domain }: { domain: string }): Promise<Domain> => {
  const { data } = await apiClient.get<Domain>(`/domains/${domain}`);

  return data;
};

export const getDomainHandles = async ({ domain }: { domain: string }): Promise<Handle[]> => {
  const { data } = await apiClient.get<Handle[]>(`/domains/${domain}/handles`);

  return data;
};

export const getDomainTransactions = async ({
  domain,
  offset,
  limit,
}: {
  domain: string;
  offset?: number;
  limit?: number;
}): Promise<DomainTransactionsResponse> => {
  const { data } = await apiClient.get<DomainTransactionsResponse>(
    `/domains/${domain}/transactions`,
    { params: { offset, limit } }
  );

  return data;
};
