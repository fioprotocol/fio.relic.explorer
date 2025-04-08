import { useCallback, useState, useEffect } from 'react';
import { getBlocks, getCurrent } from 'src/services/blocks';
import { getProducerByAccountName } from 'src/services/bpmonitor';

import { DataItem } from 'src/components/common/DataTile';

import { Block } from '@shared/types/blocks';

type UseBlocksPageContext = {
  blocks: Block[];
  currentBlock: DataItem[];
  blocksLoading: boolean;
  currentBlockLoading: boolean;
};

export const useBlocksPageContext = (): UseBlocksPageContext => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<DataItem[]>([]);
  const [blocksLoading, setBlocksLoading] = useState<boolean>(false);
  const [currentBlockLoading, setCurrentBlockLoading] = useState<boolean>(false);

  const loadCurrent = useCallback(async () => {
    try {
      setCurrentBlockLoading(true);

      const { data } = await getCurrent();
      // todo: wait for producer data
      const producer = getProducerByAccountName(data.producer_account_name);

      setCurrentBlock([
        {
          title: 'Block Number',
          value: data.pk_block_number,
        },
        {
          title: 'Date',
          value: data.stamp,
        },
        {
          title: 'Producer',
          value: `${producer?.candidate_name} | Account: ${data.producer_account_name} | FIO Handle: ${producer?.fio_address}`,
        },
        {
          title: 'Block ID',
          value: data.block_id,
        },
        {
          title: 'Transactions',
          value: data.transaction_count,
        },
        {
          title: '',
          value: '',
        },
      ]);
    } catch (error) {
      console.error('Get blocks data error', error);
    } finally {
      setCurrentBlockLoading(false);
    }
  }, []);

  const loadBlocks = useCallback(async () => {
    try {
      setBlocksLoading(true);

      const { data } = await getBlocks();
      setBlocks(
        data.map((block) => ({
          ...block,
          producer: getProducerByAccountName(block.producer_account_name)?.candidate_name,
        }))
      );
    } catch (error) {
      console.error('Get blocks data error', error);
    } finally {
      setBlocksLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrent();
  }, [loadCurrent]);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  return { currentBlock, blocks, currentBlockLoading, blocksLoading };
};
