import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

interface CircularProgressProps {
  progress: number;
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

export const ProgressCircle: React.FC<CircularProgressProps> = (
  CircularProgressProps,
) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant='determinate'
        value={CircularProgressProps.progress}
      />
    </div>
  );
};
