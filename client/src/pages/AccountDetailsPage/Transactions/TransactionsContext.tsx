import { useParams } from 'react-router';

import { useCursorPaginationData } from 'src/hooks/useCursorPaginationData';
import { PaginationProps } from 'src/hooks/usePaginationData';
import { getAccountTransactions } from 'src/services/accounts';

import { AccountTransaction } from '@shared/types/accounts';

type UseTransactionsContext = {
  loading: boolean;
  transactions: AccountTransaction[];
  paginationData: Partial<PaginationProps>;
};

export const useTransactionsContext = (): UseTransactionsContext => {
  const { id: account } = useParams();

  const {
    data: transactions,
    loading: transactionsLoading,
    ...paginationData
  } = useCursorPaginationData<AccountTransaction>({
    action: getAccountTransactions,
    params: {
      account,
    },
    dataKey: 'data',
  });

  return {
    loading: transactionsLoading,
    transactions,
    paginationData,
  };
};
