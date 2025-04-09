import { useMemo } from 'react';

import { DataItem } from 'src/components/common/DataTile';
import { DEFAULT_DAYS } from 'src/constants/stats';
import { getStats } from 'src/services/stats';
import { TransactionDataPoint } from 'src/components/TransactionChart/types';
import { useGetData } from 'src/hooks/useGetData';

type UseHomePageContext = {
  stats: DataItem[];
  chartData: TransactionDataPoint[];
  loading: boolean;
}

export const useHomePageContext = (): UseHomePageContext => {
  const { loading, response } = useGetData({ action: getStats, params: { days: DEFAULT_DAYS } });

  const stats = useMemo(() => {
    const {
      fioHandlesRegistered,
      fioHandlesActive,
      fioDomainsRegistered,
      fioDomainsActive,
      latestBlock,
      latestIrreversibleBlock
    } = response?.data || {};
    return [
      { title: 'FIO Handles Registered', value: fioHandlesRegistered },
      { title: 'FIO Domains Registered', value: fioDomainsRegistered },
      { title: 'FIO Handles Active', value: fioHandlesActive },
      { title: 'FIO Domains Active', value: fioDomainsActive },
      { title: 'Latest Block', value: latestBlock },
      { title: 'Last Irreversible Block', value: latestIrreversibleBlock },
    ]
  }, [response?.data]);

  return { chartData: response?.data?.transactions || [], stats, loading };
};
