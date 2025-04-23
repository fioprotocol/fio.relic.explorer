import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { getDomainTransactions } from 'src/services/domains';

import { DomainTransaction } from '@shared/types/domains';

type UseTransactionsContext = {
  transactions?: DomainTransaction[];
  loading: boolean;
  paginationData: UsePaginationDefaultProps;
};

export const useTransactionsContext = ({ domain }: { domain: string }): UseTransactionsContext => {
  const {
    data: transactions,
    fetched,
    loading,
    ...paginationData
  } = usePaginationData<DomainTransaction>({
    dataKey: 'transactions',
    action: getDomainTransactions,
    params: { domain },
    withNavigation: false,
  });

  return {
    transactions: fetched ? transactions : undefined,
    loading,
    paginationData,
  };
};
