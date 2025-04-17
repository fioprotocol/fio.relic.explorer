import { FC } from 'react';
import Chart  from '../common/Chart/Chart';

import { DEFAULT_DAYS } from '@shared/constants/stats';

import { TransactionChartProps } from './types';

export const TransactionChart: FC<TransactionChartProps> = ({
  chartData,
  title = `Transaction History in ${DEFAULT_DAYS} Days`,
}) => {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
    <div className="border border-0 pt-2 ps-0 px-3 rounded-3 w-100">
      <Chart
        data={chartData}
        title={title}
        xAxisKey="date"
        yAxisKey="transactions"
        xAxisFormatter={formatDate}
        yAxisFormatter={formatTransactions}
        tooltipFormatter={formatTooltipDate}
      />
    </div>
  );
};

export default TransactionChart;
