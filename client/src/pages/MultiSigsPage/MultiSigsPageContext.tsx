import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { getMultiSigsData } from 'src/services/hyperion';

import { Proposal } from '@shared/types/hyperion';

export type UseMultiSigsPageContextType = {
  loading: boolean;
  fetched: boolean;
  proposals: Proposal[];
  paginationProps: UsePaginationDefaultProps;
};

export const useMultiSigsPageContext = (): UseMultiSigsPageContextType => {
  const { data, loading, fetched, ...paginationProps } = usePaginationData<Proposal>({
    action: getMultiSigsData,
    dataKey: 'proposals',
  });

  return {
    fetched,
    loading,
    paginationProps,
    proposals: data || [],
  };
};
