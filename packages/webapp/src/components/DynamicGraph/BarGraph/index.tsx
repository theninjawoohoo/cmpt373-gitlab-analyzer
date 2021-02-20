// import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { graphData } from './sampleData';

// const useStyles = makeStyles(() => ({}));

interface DataProps {
  startDate: number;
  endDate: number;
}

const BarGraph: React.FC<DataProps> = (DataProps) => {
  const { startDate, endDate } = DataProps;
  const [data, setData] = useState(graphData);

  // const styles = useStyles();

  useEffect(() => {
    if (startDate != 20210214 || endDate != 2021030) {
      setData(
        graphData.filter(
          (graphData) =>
            graphData.date >= startDate && graphData.date <= endDate,
        ),
      );
    } else {
      setData(graphData);
    }
  }, [graphData]);

  return (
    <div>
      <BarChart width={1000} height={500} data={data}>
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='commits' name='Commits' stackId='a' fill='#0A4D63' />
        <Bar dataKey='mrs' name='Merge Requests' stackId='a' fill='#e37500' />
      </BarChart>
    </div>
  );
};

export default BarGraph;
