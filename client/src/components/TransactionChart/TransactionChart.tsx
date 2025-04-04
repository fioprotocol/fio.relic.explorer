import { FC } from 'react';
import Chart  from '../common/Chart/Chart';

import { DEFAULT_DAYS } from '../../constants/stats';

import { TransactionChartProps } from './types';

import './TransactionChart.module.scss';

export const TransactionChart: FC<TransactionChartProps> = ({
  chartData,
  title = `Transaction History in ${DEFAULT_DAYS} Days`,
}) => {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTransactions = (value: number, index?: number): string => {
    if (index === 0) {
      return '';
    }

    return `${value / 1000}k`;
  };

  const formatTooltipDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="transaction-chart">
      <Chart
        data={chartData}
        title={title}
        xAxisKey="date"
        yAxisKey="transactions"
        xAxisFormatter={formatDate}
        yAxisFormatter={formatTransactions}
        tooltipFormatter={formatTooltipDate}
        lineColor="#000000"
        height={200}
        margin={{ top: 20, right: 35, left: 0, bottom: 20 }}
      />
    </div>
  );
};

export default TransactionChart;
