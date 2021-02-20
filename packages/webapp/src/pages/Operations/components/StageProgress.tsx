import { Operation } from '@ceres/types';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import CheckCircle from '@material-ui/icons/CheckCircle';
import WatchLater from '@material-ui/icons/WatchLater';
import React from 'react';
import styled from 'styled-components';

interface StageProgressProps {
  stage: Operation.Stage;
}

const Completed = styled(CheckCircle)`
  color: green;
`;

const Pending = styled(WatchLater)`
  color: dodgerblue;
`;

const StageProgress: React.FC<StageProgressProps> = ({ stage }) => {
  return (
    <Tooltip title={stage.name} placement='top'>
      <Box mx={1} display='inline'>
        {stage.status === Operation.Status.PROCESSING && (
          <CircularProgress size={22} />
        )}
        {stage.status === Operation.Status.COMPLETED && <Completed />}
        {stage.status === Operation.Status.PENDING && <Pending />}
      </Box>
    </Tooltip>
  );
};

export default StageProgress;
