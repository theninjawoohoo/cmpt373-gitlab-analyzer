// import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import BarGraph from './BarGraph';
import StudentDropdownMenu from '../Common/StudentDropdownMenu';

// const useStyles = makeStyles(() => ({}));

// interface TimelineProps {
//   startDate: Date;
//   endDate: Date;
// }

const DynamicGraph: React.FC = () => {
  // const styles = useStyles();
  const [studentName, setStudentName] = useState('All students');

  return (
    <div>
      <BarGraph startDate={20210214} endDate={20210230} />
      <StudentDropdownMenu
        studentName={studentName}
        setStudentName={setStudentName}
      />
    </div>
  );
};

export default DynamicGraph;
