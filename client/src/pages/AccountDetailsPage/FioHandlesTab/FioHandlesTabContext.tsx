import { useParams } from 'react-router';

import { getAccountFioHandles } from 'src/services/accounts';
import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';

import { AccounFioHandle } from '@shared/types/accounts';

type UseFioHandlesTabContext = {
  handles: AccounFioHandle[];
  loading: boolean;
  paginationData: UsePaginationDefaultProps;
};

export const useFioHandlesTabContext = (): UseFioHandlesTabContext => {
  const { id: account } = useParams<{ id: string }>();
  const { data, loading, ...paginationData } = usePaginationData<AccounFioHandle>({
    action: getAccountFioHandles,
    params: {
      account,
    },
  });

  return {
    handles: data,
    loading,
    paginationData,
  };
};
