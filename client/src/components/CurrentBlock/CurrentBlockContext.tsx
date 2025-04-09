import { useCallback, useState } from 'react';
import { getCurrent } from 'src/services/blocks';
import { Producer } from 'src/services/bpmonitor';

import { Block } from '@shared/types/blocks';
import useProducers from 'src/hooks/useProducers';
import useInterval from 'src/hooks/useInterval';

type UseCurrentBlockContext = {
  currentBlock?: Block;
  producer?: Producer;
  loading: boolean;
};

const REFRESH_INTERVAL = 5000;

export const useCurrentBlockContext = (): UseCurrentBlockContext => {
  const [currentBlock, setCurrentBlock] = useState<Block | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const { producer } = useProducers({ name: currentBlock?.producer_account_name });

  const loadCurrent = useCallback(async () => {
    try {
      setLoading(true);

      const block = await getCurrent();
      setCurrentBlock(block);
    } catch (error) {
      console.error('Get current block data error', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useInterval(loadCurrent, REFRESH_INTERVAL, { callImmediately: true });

  return { currentBlock, producer, loading };
};
