import { useParams } from 'react-router';

import { getAccountDomains } from 'src/services/accounts';
import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';

import { AccountDomain } from '@shared/types/accounts';

type UseDomainsTabContext = {
  domains: AccountDomain[];
  loading: boolean;
  paginationData: UsePaginationDefaultProps;
};

export const useDomainsTabContext = (): UseDomainsTabContext => {
  const { id: account } = useParams<{ id: string }>();
  const { data, loading, ...paginationData } = usePaginationData<AccountDomain>({
    action: getAccountDomains,
    params: {
      account,
    },
  });

  return {
    domains: data,
    loading,
    paginationData,
  };
}; 
