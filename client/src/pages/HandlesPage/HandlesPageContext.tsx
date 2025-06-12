import { getHandles } from 'src/services/handles';

import {
  useCursorPaginationData,
  UseCursorPaginationReturn,
} from 'src/hooks/useCursorPaginationData';

import { Handle } from '@shared/types/handles';

type UseHandlesPageContext = {
  handles: Handle[];
  total: number;
  totalActive: number;
} & Omit<UseCursorPaginationReturn<Handle>, 'data' | 'otherData'>;

export const useHandlesPageContext = (): UseHandlesPageContext => {
  const { data, otherData, ...cursorPaginationProps } = useCursorPaginationData<
    Handle,
    { total: number; active: number }
  >({
    action: getHandles,
    dataKey: 'data',
    params: { include_total: true },
  });

  return {
    handles: data || [],
    total: otherData?.total || 0,
    totalActive: otherData?.active || 0,
    ...cursorPaginationProps,
  };
};
