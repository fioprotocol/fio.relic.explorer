import { getHandles } from 'src/services/handles';

import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';

import { Handle } from '@shared/types/handles';

type UseHandlesPageContext = {
  handles: Handle[];
  total: number;
  totalActive: number;
  loading?: boolean;
  paginationProps: UsePaginationDefaultProps;
};

export const useHandlesPageContext = (): UseHandlesPageContext => {
  const { data, otherData, ...paginationProps } = usePaginationData<
    Handle,
    { all: number; active: number }
  >({ action: getHandles });

  return {
    handles: data || [],
    total: otherData?.all || 0,
    totalActive: otherData?.active || 0,
    paginationProps,
  };
};
