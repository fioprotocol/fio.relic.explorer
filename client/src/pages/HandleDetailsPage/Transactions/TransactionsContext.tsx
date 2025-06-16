import { useCursorPaginationData } from 'src/hooks/useCursorPaginationData';
import { PaginationProps } from 'src/hooks/usePaginationData';
import { getHandleTransactions } from 'src/services/handles';

import { HandleTransaction } from '@shared/types/handles';

type UseTransactionsContext = {
  transactions?: HandleTransaction[];
  loading: boolean;
  paginationData: Partial<PaginationProps>;
};

export const useTransactionsContext = ({ handle }: { handle: string }): UseTransactionsContext => {
  const {
    data: transactions,
    fetched,
    loading,
    ...paginationData
  } = useCursorPaginationData<HandleTransaction>({
    dataKey: 'data',
    action: getHandleTransactions,
    params: { handle },
  });

  return {
    transactions: fetched ? transactions : undefined,
    loading,
    paginationData,
  };
};
