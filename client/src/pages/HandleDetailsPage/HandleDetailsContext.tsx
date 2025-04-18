import { useParams } from 'react-router';

import { getHandle } from 'src/services/handles';

import { useGetData } from 'src/hooks/useGetData';

import { Handle, HandleChainData } from '@shared/types/handles';

type UseHandleDetailsContext = {
  handleParam?: string;
  handle?: Handle;
  chainData?: HandleChainData;
  loading: boolean;
  error: Error | null;
};

export const useHandleDetailsContext = (): UseHandleDetailsContext => {
  const { id: handle } = useParams();
  const { response, loading, error } = useGetData({ action: getHandle, params: { handle } });

  return {
    handleParam: handle,
    handle: response?.handle,
    chainData: response?.chainData,
    loading,
    error
  };
};
