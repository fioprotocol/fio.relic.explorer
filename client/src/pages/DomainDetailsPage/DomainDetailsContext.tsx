import { useParams } from 'react-router';

import { getDomain } from 'src/services/domains';

import { useGetData } from 'src/hooks/useGetData';

import { Domain, DomainChainData, DomainResponse } from '@shared/types/domains';

type UseDomainDetailsContext = {
  domainParam?: string;
  domain?: Domain;
  chainData?: DomainChainData;
  loading: boolean;
  error: Error | null;
};

export const useDomainDetailsContext = (): UseDomainDetailsContext => {
  const { id: domain } = useParams();
  const { response, loading, error } = useGetData<DomainResponse>({ action: getDomain, params: { domain } });

  return {
    domainParam: domain,
    domain: response?.domain,
    chainData: response?.chainData,
    loading,
    error,
  };
};
