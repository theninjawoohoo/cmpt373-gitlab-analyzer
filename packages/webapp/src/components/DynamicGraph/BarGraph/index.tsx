// import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { data } from './sampleData';

interface StudentProps {
  studentName: string;
  setStudentName: React.Dispatch<React.SetStateAction<string>>;
}

// const useStyles = makeStyles(() => ({}));

const BarGraph: React.FC<StudentProps> = (StudentProps) => {
  const [graphData, setGraphData] = useState(data);

  // const styles = useStyles();

  useEffect(() => {
    if (StudentProps.studentName != 'All students') {
      setGraphData(data);
    } else {
      setGraphData(data);
    }
  }, [graphData]);

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
