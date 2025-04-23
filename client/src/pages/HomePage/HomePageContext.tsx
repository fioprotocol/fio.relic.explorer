import { useMemo } from 'react';

import { DataItem } from 'src/components/common/DataTile';
import { DEFAULT_DAYS } from '@shared/constants/stats';
import { getStats } from 'src/services/stats';
import { TransactionDataPoint } from 'src/components/TransactionChart/types';
import { DEFAULT_REFRESH_INTERVAL } from 'src/constants/general';
import { StatsResponse } from '@shared/types/stats';
import { useGetData } from 'src/hooks/useGetData';

type UseHomePageContext = {
  stats: DataItem[];
  chartData: TransactionDataPoint[];
  loading: boolean;
};

export const useHomePageContext = (): UseHomePageContext => {
  const { response, loading } = useGetData<StatsResponse>({
    action: getStats,
    params: { days: DEFAULT_DAYS, useLastRecord: true },
    interval: DEFAULT_REFRESH_INTERVAL,
  });

  const stats = useMemo(() => {
    const {
      fioHandlesRegistered,
      fioHandlesActive,
      fioDomainsRegistered,
      fioDomainsActive,
      latestBlock,
      latestIrreversibleBlock,
    } = response?.data || {};
    return [
      { title: 'FIO Handles Registered', value: fioHandlesRegistered },
      { title: 'FIO Domains Registered', value: fioDomainsRegistered },
      { title: 'FIO Handles Active', value: fioHandlesActive },
      { title: 'FIO Domains Active', value: fioDomainsActive },
      { title: 'Latest Block', value: latestBlock },
      { title: 'Last Irreversible Block', value: latestIrreversibleBlock },
    ];
  }, [response?.data]);

  return {
    chartData: (response?.data?.transactions as TransactionDataPoint[]) || [],
    stats: stats as DataItem[],
    loading: loading && !response?.data,
  };
};
