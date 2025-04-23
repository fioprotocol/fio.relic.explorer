import { apiClient } from './api-client';

import { Domain, DomainsResponse } from '@shared/types/domains';

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
