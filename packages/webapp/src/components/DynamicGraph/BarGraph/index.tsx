// import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import { data } from './sampleData';

// const useStyles = makeStyles(() => ({}));

const BarGraph: React.FC = () => {
  const [graphData] = useState(data);
  // const styles = useStyles();
  return (
    <div>
      <BarChart width={1000} height={500} data={graphData}>
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='commits' name='Commits' stackId='a' fill='#0A4D63' />
        <Bar dataKey='mr' name='Merge Requests' stackId='a' fill='#e37500' />
      </BarChart>
    </div>
  );
};

export default BarGraph;
