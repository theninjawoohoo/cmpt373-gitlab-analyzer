import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface BarChartProps {
  graphData: any[];
  graphType: number;
}

const DynamicBarChart: React.FC<BarChartProps> = (BarChartProps) => {
  if (BarChartProps.graphType == 0) {
    return (
      <BarChart width={1000} height={500} data={BarChartProps.graphData}>
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Legend layout='vertical' align='right' verticalAlign='top' />
        <Bar dataKey='commitCount' name='Commits' stackId='a' fill='#0A4D63' />
        <Bar
          dataKey='mergeCount'
          name='Merge Requests'
          stackId='a'
          fill='#e37500'
        />
      </BarChart>
    );
  } else if (BarChartProps.graphType == 1) {
    return (
      <BarChart width={1000} height={500} data={BarChartProps.graphData}>
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Bar dataKey='score' name='Score' fill='#FFAA00' />
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
