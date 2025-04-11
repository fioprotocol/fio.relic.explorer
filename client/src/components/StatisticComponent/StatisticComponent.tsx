import React from 'react';

import { TransactionChart } from '../TransactionChart';
import { DataTile, DataItem } from '../common/DataTile';
import { TransactionDataPoint } from '../TransactionChart/types';

type StatisticComponentProps = {
  days?: number;
  stats: DataItem[];
  chartData: TransactionDataPoint[];
  loading: boolean;
};

export const StatisticComponent: React.FC<StatisticComponentProps> = ({ stats, chartData, loading }) => {
  return (
    <DataTile items={stats} columns={2} layout="multi-column" loading={loading}>
      <TransactionChart chartData={chartData} />
    </DataTile>
  );
};
