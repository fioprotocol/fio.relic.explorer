import React from 'react';

import { TransactionChart } from '../TransactionChart';
import { DataTile, DataItem } from '../common/DataTile';
import { TransactionDataPoint } from '../TransactionChart/types';

type StatisticComponentProps = {
  days?: number;
  stats: DataItem[];
  chartData: TransactionDataPoint[];
};

export const StatisticComponent: React.FC<StatisticComponentProps> = ({ stats, chartData }) => {
  return (
    <DataTile title="Statistics" items={stats} columns={2} layout="multi-column">
      <TransactionChart chartData={chartData} />
    </DataTile>
  );
};
