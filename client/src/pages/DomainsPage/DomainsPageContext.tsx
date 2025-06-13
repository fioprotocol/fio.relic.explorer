import { getDomains } from 'src/services/domains';

import {
  useCursorPaginationData,
  UseCursorPaginationReturn,
} from 'src/hooks/useCursorPaginationData';

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
  loading: boolean;
} & Omit<UseCursorPaginationReturn<Domain>, 'data' | 'otherData'>;

export const useDomainsPageContext = (): UseDomainsPageContext => {
  const [onlyPublic, setOnlyPublic] = useState(true);
  const [sort, setSort] = useState<DomainSortOption>('pk_domain_id');

  const { data, otherData, loading, ...cursorPaginationProps } = useCursorPaginationData<
    Domain,
    { total: number; active: number }
  >({
    action: getDomains,
    dataKey: 'data',
    params: { only_public: onlyPublic, sort, include_total: true },
  });

  return {
    domains: data || [],
    total: otherData?.total || 0,
    totalActive: otherData?.active || 0,
    onlyPublic,
    setOnlyPublic,
    sort,
    setSort,
    loading,
    ...cursorPaginationProps,
  };
};
