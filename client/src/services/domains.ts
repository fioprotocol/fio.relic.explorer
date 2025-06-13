import { apiClient } from './api-client';

import {
  Domain,
  DomainsResponse,
  CursorDomainsResponse,
  DomainSortOption,
} from '@shared/types/domains';
import { CursorHandlesResponse } from '@shared/types/handles';
import { PaginationDirection } from '@shared/constants/pagination';
import { DomainTransaction } from '@shared/types/domains';
import { CursorResponse } from '@shared/types/general';

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

export const getDomainHandles = async ({
  domain,
  limit,
  cursor,
  direction,
}: {
  domain: string;
  limit?: number;
  cursor?: string;
  direction?: PaginationDirection;
}): Promise<CursorHandlesResponse> => {
  const { data } = await apiClient.get<CursorHandlesResponse>(`/domains/${domain}/handles`, {
    params: {
      limit,
      cursor,
      direction,
    },
  });

  return data;
};

// Cursor-based domain transactions
export type CursorDomainTransactionsResponse = CursorResponse<{ data: DomainTransaction[] }>;

export const getDomainTransactions = async ({
  domain,
  limit,
  cursor,
  direction,
}: {
  domain: string;
  limit?: number;
  cursor?: string;
  direction?: PaginationDirection;
}): Promise<CursorDomainTransactionsResponse> => {
  const { data } = await apiClient.get<CursorDomainTransactionsResponse>(
    `/domains/${domain}/transactions`,
    { params: { limit, cursor, direction } }
  );

  return data;
};
