import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DynamicGraph from '../../components/DynamicGraph';
import DefaultPageLayout from '../../components/DefaultPageLayout';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
}));

const Graph: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <DefaultPageLayout>
        <div>
          <DynamicGraph />
        </div>
      </DefaultPageLayout>
    </div>
  );
};

export default Graph;
