import { useParams } from 'react-router';

import { getAccountDomains } from 'src/services/accounts';
import { useCursorPaginationData } from 'src/hooks/useCursorPaginationData';
import { PaginationProps } from 'src/hooks/usePaginationData';

import { AccountDomain } from '@shared/types/accounts';

type UseDomainsTabContext = {
  domains: AccountDomain[];
  loading: boolean;
  paginationData: Partial<PaginationProps>;
};

export const useDomainsTabContext = (): UseDomainsTabContext => {
  const { id: account } = useParams<{ id: string }>();
  const { data, loading, ...paginationData } = useCursorPaginationData<AccountDomain>({
    action: getAccountDomains,
    params: {
      account,
    },
    dataKey: 'data',
  });

  return {
    domains: data,
    loading,
    paginationData,
  };
};
