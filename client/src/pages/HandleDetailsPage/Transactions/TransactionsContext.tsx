import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { getHandleTransactions } from 'src/services/handles';

import { HandleTransaction } from '@shared/types/handles';

type UseTransactionsContext = {
  transactions?: HandleTransaction[];
  loading: boolean;
  paginationData: UsePaginationDefaultProps;
};

export const useTransactionsContext = ({ handle }: { handle: string }): UseTransactionsContext => {
  const {
    data: transactions,
    fetched,
    loading,
    ...paginationData
  } = usePaginationData<HandleTransaction>({
    dataKey: 'transactions',
    action: getHandleTransactions,
    params: { handle },
    withNavigation: false,
  });

  return {
    transactions: fetched ? transactions : undefined,
    loading,
    paginationData,
  };
};
