import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { graphData } from './sampleData';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
}));

interface DataProps {
  startDate: number;
  endDate: number;
}

const BarGraph: React.FC<DataProps> = (DataProps) => {
  const classes = useStyles();
  const { startDate, endDate } = DataProps;
  const [data, setData] = useState(graphData);

  useEffect(() => {
    setData(
      graphData.filter(
        (graphData) => graphData.date >= startDate && graphData.date <= endDate,
      ),
    );
  }, [graphData]);

  return (
    <BarChart width={1000} height={500} data={data} className={classes.root}>
      <XAxis dataKey='date' />
      <YAxis />
      <Tooltip />
      <Legend layout='vertical' align='right' verticalAlign='top' />
      <Bar dataKey='commits' name='Commits' stackId='a' fill='#0A4D63' />
      <Bar dataKey='mrs' name='Merge Requests' stackId='a' fill='#e37500' />
    </BarChart>
  );
};

export default BarGraph;
