import BigNumber from 'big.js';

import { BlockProducer, BlockProducerResponse } from '@shared/types/fio-api-server';
import { useGetData } from 'src/hooks/useGetData';
import { getBlockProducers } from 'src/services/fio';
import useProducers from 'src/hooks/useProducers';
import { transformBlockProducer } from 'src/utils/bpmonitor';

import { BlockProducerProps } from './types';

type UseBlockProducersPageContextType = {
  columns: { key: string; title: string }[];
  loading: boolean;
  producers: BlockProducerProps[];
};

export const useBlockProducersPageContext = (): UseBlockProducersPageContextType => {
  const { response: fioChainblockProducers, loading } = useGetData<BlockProducerResponse>({
    action: getBlockProducers,
  });

  const { producers: bpMonitorProducers, loading: bpMonitorLoading } = useProducers({
    refresh: true,
  });

  const activeFioChainProducers =
    fioChainblockProducers?.producers?.length && bpMonitorProducers?.size > 0
      ? fioChainblockProducers?.producers?.filter(
          (blockProducer: BlockProducer) =>
            blockProducer?.is_active === 1 && new BigNumber(blockProducer?.total_votes).gt(0)
        )
      : [];

  const producers = activeFioChainProducers
    ?.map((blockProducer) =>
      transformBlockProducer({ producer: blockProducer, bpMonitorProducers })
    );

  const columns = [
    { key: 'name', title: 'Block Producer' },
    { key: 'account', title: 'Account' },
    { key: 'fioHandle', title: 'FIO Handle' },
    { key: 'votes', title: 'Votes' },
    { key: 'links', title: 'Social' },
    { key: 'location', title: 'Location' },
    { key: 'grade', title: 'Grade' },
    { key: 'ranks', title: 'Ranks' },
  ];

  return { columns, loading: loading || bpMonitorLoading, producers };
};
