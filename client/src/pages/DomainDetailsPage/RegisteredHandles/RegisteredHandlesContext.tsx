import { useCursorPaginationData } from 'src/hooks/useCursorPaginationData';
import { PaginationProps } from 'src/hooks/usePaginationData';
import { getDomainHandles } from 'src/services/domains';

import { Handle } from '@shared/types/handles';

type UseRegisteredHandlesContext = {
  error: Error | null;
  handles?: Handle[];
  loading: boolean;
  paginationData: Partial<PaginationProps>;
};

export const useRegisteredHandlesContext = ({
  domain,
}: {
  domain: string;
}): UseRegisteredHandlesContext => {
  const {
    data: handles,
    fetched,
    loading,
    error,
    ...paginationData
  } = useCursorPaginationData<Handle>({
    dataKey: 'data',
    action: getDomainHandles,
    params: { domain },
  });

  return {
    error,
    handles: fetched ? handles : undefined,
    loading,
    paginationData,
  };
};
