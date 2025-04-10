import { getBlocks } from 'src/services/blocks';

import useProducers from 'src/hooks/useProducers';

import { Block } from '@shared/types/blocks';
import { ProducerMap } from 'src/services/bpmonitor';

import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
type UseBlocksPageContext = {
  blocks: Block[];
  producers: ProducerMap;
  loading?: boolean;
} & UsePaginationDefaultProps;

export const useBlocksPageContext = (): UseBlocksPageContext => {
  const { producers } = useProducers();
  const { data, ...paginationProps } = usePaginationData<Block>({ action: getBlocks });

  return { blocks: data, producers, ...paginationProps };
};
