import {
  useCursorPaginationData,
  UseCursorPaginationReturn,
} from 'src/hooks/useCursorPaginationData';
import { getBlocks } from 'src/services/blocks';
import { Block } from '@shared/types/blocks';
import useProducers from 'src/hooks/useProducers';
import { ProducerMap } from 'src/services/bpmonitor';

type UseBlocksPageContext = {
  blocks: Block[];
  blocksLoading: boolean;
  currentBlock?: Block;
  producers: ProducerMap;
  totalBlocks: number;
} & Omit<UseCursorPaginationReturn<Block>, 'data' | 'otherData' | 'loading'>;

export const useBlocksPageContext = (): UseBlocksPageContext => {
  const { producers } = useProducers();
  const {
    data: blocks,
    otherData,
    loading,
    ...cursorPaginationProps
  } = useCursorPaginationData<Block, { total: number; current_block: Block }>({
    action: getBlocks,
    dataKey: 'data',
  });

  return {
    blocks: blocks || [],
    blocksLoading: loading,
    currentBlock: otherData?.current_block,
    producers,
    totalBlocks: otherData?.total || 0,
    ...cursorPaginationProps,
  };
};
