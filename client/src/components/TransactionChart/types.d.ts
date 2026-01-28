import { ChartDataPoint } from '../common/Chart/Chart';

import { TransactionsByDate } from '@shared/types/stats';

export interface TransactionDataPoint extends ChartDataPoint, TransactionsByDate {}

export interface TransactionChartProps {
  chartData: TransactionDataPoint[];
  title?: string;
}
