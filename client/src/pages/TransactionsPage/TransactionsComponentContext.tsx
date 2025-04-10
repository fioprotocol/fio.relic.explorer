import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { getTransactions } from 'src/services/transactions';
import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { transformTransactions } from 'src/utils/transactions';

import { TransformedTransaction, Transaction } from '@shared/types/transactions';
import { ROUTES } from 'src/constants/routes';

type UseTransactionsComponentContext = {
  onActionButtonClick: () => void;
  transactions: TransformedTransaction[];
} & UsePaginationDefaultProps;

export const useTransactionsComponentContext = (): UseTransactionsComponentContext => {
  const { 
    data,
    ...paginationProps
  } = usePaginationData<Transaction>({
    action: getTransactions,
    dataKey: 'transactions',
  });

  const navigate = useNavigate();

  const transactions: TransformedTransaction[] = 
    data?.map(dataItem => transformTransactions(dataItem)) || [];

  const onActionButtonClick = useCallback(() => {
    navigate(ROUTES.transactions.path);
  }, [navigate]);

  return { 
    transactions,
    ...paginationProps,
    onActionButtonClick,
  };
};
