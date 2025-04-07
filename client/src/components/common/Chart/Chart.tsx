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
import './Chart.scss';

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

const COLOR_PRIMARY = '#765CD6';

const defaultFormatter = (value: DataValue): string => value;

const Chart: React.FC<ChartProps> = ({
  data,
  title,
  xAxisKey,
  yAxisKey,
  xAxisFormatter = defaultFormatter,
  yAxisFormatter = defaultFormatter,
  tooltipFormatter = defaultFormatter,
  lineColor = COLOR_PRIMARY,
  height = 300,
  margin = { top: 20, right: 20, left: 0, bottom: 20 },
}) => {
  return (
    <div className="chart">
      {title && <h2 className="chart-title">{title}</h2>}
      <div className="w-100 h-100">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickFormatter={xAxisFormatter}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={yAxisFormatter}
              domain={['auto', 'auto']}
              axisLine={false}
              tickCount={3}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }): React.ReactNode => {
                if (active && payload && payload.length && payload[0]?.value !== undefined) {
                  return (
                    <div className="custom-tooltip border-0">
                      <p className="tooltip-label">{tooltipFormatter(label)}</p>
                      <p className="tooltip-value m-0">Transactions: {payload[0].value.toLocaleString()}</p>
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
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
