import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { getHandleTransactions } from 'src/services/handles';

import { HandleTransaction } from '@shared/types/handles';

type UseTransactionsContext = {
  transactions: HandleTransaction[];
  paginationData: UsePaginationDefaultProps;
};

export const useTransactionsContext = ({ handle }: { handle: string }): UseTransactionsContext => {
  const {
    data: transactions,
    loading: txLoading,
    ...paginationData
  } = usePaginationData<HandleTransaction>({
    dataKey: 'transactions',
    action: getHandleTransactions,
    params: { handle },
  });

  return {
    transactions: transactions || [],
    paginationData,
  };
};
