import { apiClient } from './api-client';

import { Domain, DomainsResponse, DomainTransactionsResponse } from '@shared/types/domains';
import { Handle } from '@shared/types/handles';

export const getDomains = async (params: {
  offset: number;
  limit: number;
  order: 'asc' | 'desc';
  sort: 'pk_domain_id' | 'domain_name' | 'expiration_timestamp';
  only_public: boolean;
}): Promise<DomainsResponse> => {
  const response = await apiClient.get<DomainsResponse>('/domains', { params });
  return response.data;
};

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
