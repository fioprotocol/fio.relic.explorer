import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { getDomainHandles } from 'src/services/domains';

import { Handle } from '@shared/types/handles';

type UseRegisteredHandlesContext = {
  handles?: Handle[];
  loading: boolean;
  paginationData: UsePaginationDefaultProps;
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
    ...paginationData
  } = usePaginationData<Handle>({
    dataKey: 'handles',
    action: getDomainHandles,
    params: { domain },
    withNavigation: false,
  });

  return {
    handles: fetched ? handles : undefined,
    loading,
    paginationData,
  };
};
