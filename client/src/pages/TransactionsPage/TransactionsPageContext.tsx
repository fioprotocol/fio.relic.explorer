import { useMemo } from 'react';

import { DataItem } from 'src/components/common/DataTile';
import { getTransactionStats } from 'src/services/transactions';

import { DEFAULT_TRANSACTION_STATS_DAYS } from '@shared/constants/network';
import { TransactionStats } from '@shared/types/transactions';
import { useGetData } from 'src/hooks/useGetData';
import { formatFioAmount } from 'src/utils/fio';

type UseTransactionsPageContext = {
  stats: DataItem[];
  loading: boolean;
};

export const useTransactionsPageContext = (): UseTransactionsPageContext => {
  const { response, loading } = useGetData<TransactionStats>({ action: getTransactionStats, params: { days: DEFAULT_TRANSACTION_STATS_DAYS } });

  const stats = useMemo(() => {
    return [
      { title: 'Transactions (30 Days)', value: response?.transactionsCount },
      { title: 'Transaction Fees (30 Days)', value: formatFioAmount(response?.transactionFees) },
      { title: 'AVG Transaction Fee (30 Days)', value: formatFioAmount(response?.avgTransactionFee) },
    ];
  }, [response]);

  return {
    stats,
    loading,
  };
};
