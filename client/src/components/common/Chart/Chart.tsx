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
      {title && <h2 className="text-start">{title}</h2>}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
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
                if (active && payload && payload.length) {
                  return (
                    <div className="custom-tooltip">
                      <p className="label">{tooltipFormatter(label)}</p>
                      <p className="value">{yAxisFormatter(payload[0].value)}</p>
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
              activeDot={{ r: 8 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
