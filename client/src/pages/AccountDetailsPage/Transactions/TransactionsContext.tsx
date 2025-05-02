import { useParams } from 'react-router';

import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { getAccountTransactions } from 'src/services/accounts';

import { AccountTransaction } from '@shared/types/accounts';

type UseTransactionsContext = {
  loading: boolean;
  transactions: AccountTransaction[];
  paginationData: UsePaginationDefaultProps;
};

export const useTransactionsContext = (): UseTransactionsContext => {
  const { id: account } = useParams();

  const {
    data: transactions,
    loading: transactionsLoading,
    ...paginationData
  } = usePaginationData<AccountTransaction>({
    action: getAccountTransactions,
    params: {
      account: account,
    },
    dataKey: 'transactions',
  });

  return {
    loading: transactionsLoading,
    transactions,
    paginationData,
  };
};
