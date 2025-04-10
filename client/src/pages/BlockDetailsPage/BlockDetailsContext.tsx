import { useParams } from 'react-router';

import { getBlock } from 'src/services/blocks';

import useProducers from 'src/hooks/useProducers';
import { useGetData } from 'src/hooks/useGetData';

import { Block } from '@shared/types/blocks';
import { Producer } from 'src/services/bpmonitor';

type UseBlockDetailsContext = {
  block_number?: number;
  block?: Block;
  previous_block_number?: number;
  next_block_number?: number;
  producer?: Producer;
  loading?: boolean;
};

export const useBlockDetailsContext = (): UseBlockDetailsContext => {
  const { id: block_number } = useParams();
  const { producers } = useProducers();
  const { response, loading } = useGetData({ action: getBlock, params: { block_number } });

  return {
    block_number: Number(block_number),
    block: response?.block,
    previous_block_number: response?.previous_block_number,
    next_block_number: response?.next_block_number,
    producer: producers.get(response?.block?.producer_account_name),
    loading,
  };
};
