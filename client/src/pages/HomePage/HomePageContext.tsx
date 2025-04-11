import { useMemo, useState, useCallback } from 'react';

import { DataItem } from 'src/components/common/DataTile';
import { DEFAULT_DAYS } from 'src/constants/stats';
import { getStats } from 'src/services/stats';
import { TransactionDataPoint } from 'src/components/TransactionChart/types';
import { DEFAULT_REFRESH_INTERVAL } from 'src/constants/general';

import useInterval from 'src/hooks/useInterval';
import { StatsResponse } from '@shared/types/stats';

type UseHomePageContext = {
  stats: DataItem[];
  chartData: TransactionDataPoint[];
  loading: boolean;
}

export const useHomePageContext = (): UseHomePageContext => {
  const [response, setResponse] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getStats({ days: DEFAULT_DAYS, useLastRecord: true });
      setResponse(result);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data every 5 seconds
  useInterval(fetchStats, DEFAULT_REFRESH_INTERVAL, { callImmediately: true });

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

  return { 
    chartData: response?.data?.transactions as TransactionDataPoint[] || [], 
    stats: stats as DataItem[], 
    loading: loading && !response?.data
  };
};
