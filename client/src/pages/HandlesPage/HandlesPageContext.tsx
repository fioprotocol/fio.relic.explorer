import { getHandles } from 'src/services/handles';

import { useGetData } from 'src/hooks/useGetData';

import { Handle } from '@shared/types/handles';

type UseHandlesPageContext = {
  handles: Handle[];
  total: number;
  totalActive: number;
  loading?: boolean;
};

export const useHandlesPageContext = (): UseHandlesPageContext => {
  const { response } = useGetData({ action: getHandles });

  return {
    handles: response?.data || [],
    total: response?.total || 0,
    totalActive: response?.totalActive || 0,
  };
};
