import { useCursorPaginationData } from 'src/hooks/useCursorPaginationData';
import { PaginationProps } from 'src/hooks/usePaginationData';
import { getDomainTransactions } from 'src/services/domains';

import { DomainTransaction } from '@shared/types/domains';

type UseTransactionsContext = {
  transactions?: DomainTransaction[];
  loading: boolean;
  paginationData: Partial<PaginationProps>;
};

export const useTransactionsContext = ({ domain }: { domain: string }): UseTransactionsContext => {
  const {
    data: transactions,
    fetched,
    loading,
    ...paginationData
  } = useCursorPaginationData<DomainTransaction>({
    dataKey: 'data',
    action: getDomainTransactions,
    params: { domain },
  });

  return {
    transactions: fetched ? transactions : undefined,
    loading,
    paginationData,
  };
};
