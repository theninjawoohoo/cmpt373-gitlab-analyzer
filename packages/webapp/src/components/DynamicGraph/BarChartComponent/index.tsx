import { DateTime } from 'luxon';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import SmartDate from '../../SmartDate';

interface BarChartProps {
  graphData: any[];
  graphType: number;
}

// // https://recharts.org/en-US/examples/CustomizedLabelLineChart
const DateTick: React.FC<any> = (props) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor='end' fill='#666'>
        <SmartDate includeTime={false}>{payload.value}</SmartDate>
      </text>
    </g>
  );
};

const DynamicBarChart: React.FC<BarChartProps> = (BarChartProps) => {
  if (BarChartProps.graphType == 0) {
    return (
      <BarChart
        width={1000}
        height={500}
        stackOffset='sign'
        data={BarChartProps.graphData}
      >
        <XAxis dataKey='date' tick={DateTick} />
        <YAxis tickFormatter={(value) => Math.abs(value).toString()} />
        <ReferenceLine y={0} stroke='#000' />
        <Tooltip
          labelFormatter={(value) =>
            DateTime.fromISO(value).toFormat('LLL dd yyyy')
          }
          formatter={(value) => Math.abs(value).toString()}
        />
        <Legend layout='vertical' align='right' verticalAlign='top' />
        <Bar dataKey='commitCount' name='Commits' stackId='a' fill='#0A4D63' />
        <Bar
          dataKey='mergeRequestCount'
          name='Merge Requests'
          stackId='a'
          fill='#e37500'
        />
      </BarChart>
    );
  } else if (BarChartProps.graphType == 1) {
    return (
      <BarChart
        width={1000}
        height={500}
        stackOffset='sign'
        data={BarChartProps.graphData}
      >
        <XAxis dataKey='date' tick={DateTick} />
        <YAxis
          tickFormatter={(value) => Math.round(Math.abs(value)).toString()}
        />
        <Tooltip
          labelFormatter={(value) =>
            DateTime.fromISO(value).toFormat('LLL dd yyyy')
          }
          formatter={(value) => Math.abs(value).toFixed(1)}
        />
        <Bar dataKey='commitScore' name='Commits' stackId='a' fill='#0A4D63' />
        <Bar
          dataKey='mergeRequestScore'
          name='Merge Requests'
          stackId='a'
          fill='#e37500'
        />
      </BarChart>
    );
  } else {
    return (
      <BarChart width={1000} height={500} data={BarChartProps.graphData}>
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Bar dataKey='wordCount' name='Word Counts' fill='#0A4D63' />
      </BarChart>
    );
  }
};

export default DynamicBarChart;
