import { getTransactions } from 'src/services/transactions';
import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { transformTransactions } from 'src/utils/transactions';

import { TransformedTransaction, Transaction } from '@shared/types/transactions';


type UseTxComponentContext = {
  transactions: TransformedTransaction[];
} & UsePaginationDefaultProps;

export const useTxComponentContext = (): UseTxComponentContext => {
  const { 
    data,
    ...paginationProps
  } = usePaginationData<Transaction>({
    action: getTransactions,
    dataKey: 'transactions',
  });

  const transactions: TransformedTransaction[] = 
    data?.map(dataItem => transformTransactions(dataItem)) || [];

  return { 
    transactions,
    ...paginationProps,
  };
};
