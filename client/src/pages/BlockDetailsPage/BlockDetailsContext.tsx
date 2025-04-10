import { useParams } from 'react-router';

import { getBlock } from 'src/services/blocks';

import useProducers from 'src/hooks/useProducers';
import { useGetData } from 'src/hooks/useGetData';

import { Block } from '@shared/types/blocks';
import { Transaction } from '@shared/types/transactions';
import { Producer } from 'src/services/bpmonitor';
import { getInfo } from 'src/services/fio';
import { getTransactions } from 'src/services/transactions';

type UseBlockDetailsContext = {
  block_number?: number;
  block?: Block;
  previous_block_number?: number;
  next_block_number?: number;
  producer?: Producer;
  loading?: boolean;
  last_irreversible_block_num?: number;
  transactions?: Transaction[];
};

export const useBlockDetailsContext = (): UseBlockDetailsContext => {
  const { id: block_number } = useParams();
  const { producers } = useProducers();
  const { response, loading } = useGetData({ action: getBlock, params: { block_number } });
  const { response: txResponse } = useGetData({
    action: getTransactions,
    params: { block_number },
  });
  const { response: chainInfo } = useGetData({ action: getInfo, params: { block_number } });

  return {
    block_number: Number(block_number),
    block: response?.block,
    previous_block_number: response?.previous_block_number,
    next_block_number: response?.next_block_number,
    producer: producers.get(response?.block?.producer_account_name),
    last_irreversible_block_num: chainInfo?.last_irreversible_block_num,
    transactions: txResponse?.transactions || [],
    loading,
  };
};
