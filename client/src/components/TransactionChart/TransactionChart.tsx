import React, { useEffect, useState } from 'react';

import Chart, { ChartDataPoint } from '../common/Chart/Chart';

import './TransactionChart.scss';

interface TransactionDataPoint extends ChartDataPoint {
  date: string;
  transactions: number;
}

interface TransactionChartProps {
  data?: TransactionDataPoint[];
  title?: string;
}

const TransactionChart: React.FC<TransactionChartProps> = ({
  title = 'Transaction History in 7 Days',
}) => {
  const [data, setData] = useState<TransactionDataPoint[]>([]);

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

  useEffect(() => {
    setData([
      { date: '2023-12-29', transactions: 150000 },
      { date: '2024-01-01', transactions: 250000 },
      { date: '2024-01-03', transactions: 380000 },
      { date: '2024-01-04', transactions: 310000 },
      { date: '2024-01-06', transactions: 110000 },
    ]);
  }, []);

  return (
    <div className="transaction-chart">
      <Chart
        data={data}
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
