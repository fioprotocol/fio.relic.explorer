import { getTransactions } from 'src/services/transactions';
import { usePaginationData } from 'src/hooks/usePaginationData';
import { transformTransactions } from 'src/utils/transactions';

import { TransformedTransaction, Transaction } from '@shared/types/transactions';

type UseTransactionsComponentContext = {
  transactions: TransformedTransaction[];
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasMore: boolean;
};

export const useTransactionsComponentContext = (): UseTransactionsComponentContext => {
  const { 
    data, 
    loading, 
    error, 
    loadMore,
    hasMore
  } = usePaginationData<Transaction>({
    action: getTransactions,
    dataKey: 'transactions',
  });

  const transactions: TransformedTransaction[] = 
    data?.map(dataItem => transformTransactions(dataItem)) || [];

  return { 
    transactions,
    loading, 
    error,
    loadMore,
    hasMore
  };
};
