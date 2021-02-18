// import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import BarGraph from './BarGraph';
import StudentDropdownMenu from '../DropdownMenu';

// const useStyles = makeStyles(() => ({}));

const DynamicGraph: React.FC = () => {
  // const styles = useStyles();
  return (
    <div>
      <BarGraph />
      <StudentDropdownMenu />
    </div>
  );
};

export default DynamicGraph;
