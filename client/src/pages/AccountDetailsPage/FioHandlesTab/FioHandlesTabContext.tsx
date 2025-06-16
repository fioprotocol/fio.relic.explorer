import { useParams } from 'react-router';

import { getAccountFioHandles } from 'src/services/accounts';
import { useCursorPaginationData } from 'src/hooks/useCursorPaginationData';
import { PaginationProps } from 'src/hooks/usePaginationData';

import { AccounFioHandle } from '@shared/types/accounts';

type UseFioHandlesTabContext = {
  handles: AccounFioHandle[];
  loading: boolean;
  paginationData: Partial<PaginationProps>;
};

export const useFioHandlesTabContext = (): UseFioHandlesTabContext => {
  const { id: account } = useParams<{ id: string }>();
  const { data, loading, ...paginationData } = useCursorPaginationData<AccounFioHandle>({
    action: getAccountFioHandles,
    params: {
      account,
    },
    dataKey: 'data',
  });

  return {
    handles: data,
    loading,
    paginationData,
  };
};
