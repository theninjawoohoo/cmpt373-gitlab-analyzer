import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const data = [
  {
    date: '14',
    commits: 2,
    mr: 0,
  },
  {
    date: '15',
    commits: 4,
    mr: 1,
  },
  {
    date: '16',
    commits: 0,
    mr: 0,
  },
  {
    date: '17',
    commits: 3,
    mr: 2,
  },
  {
    date: '18',
    commits: 9,
    mr: 1,
  },
  {
    date: '19',
    commits: 1,
    mr: 0,
  },
  {
    date: '20',
    commits: 5,
    mr: 2,
  },
];

export default class Example extends React.PureComponent {
  render() {
    return (
      <BarChart
        width={1000}
        height={500}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='commits' stackId='a' fill='#8884d8' />
        <Bar dataKey='mr' stackId='a' fill='#82ca9d' />
      </BarChart>
    );
  }
}
