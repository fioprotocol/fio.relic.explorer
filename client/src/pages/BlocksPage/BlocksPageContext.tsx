import { getBlocks } from 'src/services/blocks';

import useProducers from 'src/hooks/useProducers';

import { Block } from '@shared/types/blocks';
import { ProducerMap } from 'src/services/bpmonitor';
import { useGetData } from 'src/hooks/useGetData';

type UseBlocksPageContext = {
  blocks: Block[];
  producers: ProducerMap;
  loading?: boolean;
};

export const useBlocksPageContext = (): UseBlocksPageContext => {
  const { producers } = useProducers();
  const { response } = useGetData({ action: getBlocks });

  return { blocks: response?.data || [], producers };
};
