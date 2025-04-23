import { getDomains } from 'src/services/domains';

import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';

import { Domain, DomainSortOption } from '@shared/types/domains';
import { useState } from 'react';

type UseDomainsPageContext = {
  domains: Domain[];
  total: number;
  totalActive: number;
  onlyPublic: boolean;
  setOnlyPublic: (onlyPublic: boolean) => void;
  sort: DomainSortOption;
  setSort: (sort: DomainSortOption) => void;
  loading?: boolean;
  paginationProps: UsePaginationDefaultProps;
};

export const useDomainsPageContext = (): UseDomainsPageContext => {
  const [onlyPublic, setOnlyPublic] = useState(true);
  const [sort, setSort] = useState<DomainSortOption>('pk_domain_id');

  const { data, otherData, loading, ...paginationProps } = usePaginationData<
    Domain,
    { all: number; active: number }
  >({ action: getDomains, params: { only_public: onlyPublic, sort } });

  return {
    domains: data || [],
    total: otherData?.all || 0,
    totalActive: otherData?.active || 0,
    onlyPublic,
    setOnlyPublic,
    sort,
    setSort,
    loading,
    paginationProps,
  };
};
