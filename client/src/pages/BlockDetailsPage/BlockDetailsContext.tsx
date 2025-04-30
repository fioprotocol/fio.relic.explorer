import { useNavigate, useParams } from 'react-router';

import { getBlock } from 'src/services/blocks';

import useProducers from 'src/hooks/useProducers';
import { useGetData } from 'src/hooks/useGetData';

import { Producer } from 'src/services/bpmonitor';
import { ChainInfo, getInfo } from 'src/services/fio';
import { getTransactions } from 'src/services/transactions';

import { Block, BlockResponseData } from '@shared/types/blocks';
import { Transaction, TransactionResponse } from '@shared/types/transactions';

type UseBlockDetailsContext = {
  block_number?: number;
  block?: Block;
  previous_block_number: number | null;
  next_block_number: number | null;
  producer?: Producer;
  loading?: boolean;
  last_irreversible_block_num?: number;
  transactions?: Transaction[];
  error: Error | null;
  onBack: () => void;
};

export const useBlockDetailsContext = (): UseBlockDetailsContext => {
  const navigate = useNavigate();
  const { id: block_number } = useParams();
  const { producers } = useProducers();
  const { response, loading, error } = useGetData<BlockResponseData>({
    action: getBlock,
    params: { block_number },
  });
  const { response: txResponse } = useGetData<TransactionResponse>({
    action: getTransactions,
    params: { block_number },
  });
  const { response: chainInfo } = useGetData<ChainInfo>({
    action: getInfo,
    params: { block_number },
  });

  const onBack = (): void => {
    navigate(-1);
  };

  return {
    block_number: Number(block_number),
    block: response?.block,
    previous_block_number: response?.previous_block_number,
    next_block_number: response?.next_block_number,
    producer: producers.get(response?.block?.producer_account_name),
    last_irreversible_block_num: chainInfo?.last_irreversible_block_num,
    transactions: txResponse?.transactions || [],
    onBack,
    error,
    loading,
  };
};
