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

  const getTxData = async (): Promise<void> => {
    const response = await fetch('/api/transactions-stats');
    const responseData = await response.json();
    setData(responseData.data.transactions);
  };

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
    getTxData();
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
