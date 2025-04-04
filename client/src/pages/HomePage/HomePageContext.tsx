import { useCallback, useState, useEffect } from 'react';
import { DataItem } from 'src/components/common/DataTile';
import { DEFAULT_DAYS } from 'src/constants/stats';
import { getStats } from 'src/services/stats';
import { TransactionDataPoint } from 'src/components/TransactionChart/types';

type UseHomePageContext = {
  stats: DataItem[];
  chartData: TransactionDataPoint[];
  loading: boolean;
}

export const useHomePageContext = (): UseHomePageContext => {
  const [stats, setStats] = useState<DataItem[]>([]);
  const [chartData, setChartData] = useState<TransactionDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getStatsData = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await getStats(DEFAULT_DAYS);

      const { fioHandlesRegistered, fioHandlesActive, fioDomainsRegistered, fioDomainsActive, latestBlock, latestIrreversibleBlock, transactions } = data;
      
      setStats([
        { title: 'FIO Handles Registered', value: fioHandlesRegistered },
        { title: 'FIO Domains Registered', value: fioDomainsRegistered },
        { title: 'FIO Handles Active', value: fioHandlesActive },
        { title: 'FIO Domains Active', value: fioDomainsActive },
        { title: 'Latest Block', value: latestBlock },
        { title: 'Last Irreversible Block', value: latestIrreversibleBlock },
      ]);

      setChartData(transactions as TransactionDataPoint[]);
    } catch (error) {
      console.error('Get stats data error', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getStatsData();
  }, [getStatsData]);

  return { chartData, stats, loading };
};
