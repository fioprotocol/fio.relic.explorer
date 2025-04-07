import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import styles from './Chart.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataValue = any;

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  xAxisKey: string;
  yAxisKey: string;
  xAxisFormatter?: (value: DataValue, index?: number) => string;
  yAxisFormatter?: (value: DataValue, index?: number) => string;
  tooltipFormatter?: (value: DataValue) => string;
  lineColor?: string;
  height?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const COLOR_LINE = '#000000';
const COLOR_SECONDARY = '#d9d9d9';
const COLOR_GRID = '#eee';

const defaultFormatter = (value: DataValue): string => value;

const Chart: React.FC<ChartProps> = ({
  data,
  title,
  xAxisKey,
  yAxisKey,
  xAxisFormatter = defaultFormatter,
  yAxisFormatter = defaultFormatter,
  tooltipFormatter = defaultFormatter,
  lineColor = COLOR_LINE,
  height = 300,
  margin = { top: 20, right: 20, left: 0, bottom: 20 },
}) => {
  return (
    <div className={styles.chart}>
      {title && <h6>{title}</h6>}
      <div>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLOR_GRID} vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickFormatter={xAxisFormatter}
              axisLine={false}
              tickLine={false}
              className="f-size-xs"
              tick={{ fill: COLOR_LINE }}
              dy={10}
            />
            <YAxis
              tickFormatter={yAxisFormatter}
              domain={['auto', 'auto']}
              axisLine={false}
              tickCount={3}
              tickLine={false}
              className="f-size-xs"
            />
            <Tooltip
              content={({ active, payload, label }): React.ReactNode => {
                if (active && payload && payload.length && payload[0]?.value !== undefined) {
                  return (
                    <div
                      className={`${styles.customTooltip} bg-dark px-3 py-2 rounded-3 text-white`}
                    >
                      <p className="mb-0 f-size-xs">{tooltipFormatter(label)}</p>
                      <p className="mb-0 f-size-xs">
                        Transactions: {payload[0].value.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey={yAxisKey}
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 10, fill: COLOR_SECONDARY, strokeWidth: 0 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
