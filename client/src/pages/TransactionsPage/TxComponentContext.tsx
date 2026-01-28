import { getTransactions } from 'src/services/transactions';
import {
  useCursorPaginationData,
  UseCursorPaginationReturn,
} from 'src/hooks/useCursorPaginationData';
import { transformTransactions } from 'src/utils/transactions';

import { TransformedTransaction, Transaction } from '@shared/types/transactions';

type UseTxComponentContext = {
  transactions: TransformedTransaction[];
} & Omit<UseCursorPaginationReturn<Transaction>, 'data' | 'otherData'>;

export const useTxComponentContext = (): UseTxComponentContext => {
  const { data, otherData, ...cursorPaginationProps } = useCursorPaginationData<Transaction>({
    action: getTransactions,
    dataKey: 'transactions',
  });

  const transactions: TransformedTransaction[] =
    data?.map((dataItem) => transformTransactions(dataItem)) || [];

  return {
    transactions,
    ...cursorPaginationProps,
  };
};
