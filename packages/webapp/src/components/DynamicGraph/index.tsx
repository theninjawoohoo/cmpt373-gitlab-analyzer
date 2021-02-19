// import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import BarGraph from './BarGraph';
import StudentDropdownMenu from '../Common/StudentDropdownMenu';

// const useStyles = makeStyles(() => ({}));

// interface TimelineProps {
//   startDate: Date;
//   endDate: Date;
// }

const DynamicGraph: React.FC = () => {
  // const styles = useStyles();
  const [studentName, setStudentName] = React.useState('All students');

  return (
    <div>
      <BarGraph studentName={studentName} setStudentName={setStudentName} />
      <StudentDropdownMenu
        studentName={studentName}
        setStudentName={setStudentName}
      />
    </div>
  );
};

export default DynamicGraph;
