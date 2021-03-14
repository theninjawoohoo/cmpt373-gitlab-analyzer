import { Repository } from '@ceres/types';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import React from 'react';

interface ScoringConfigWarningProps {
  repository?: Repository;
}

const ScoringConfigWarning: React.FC<ScoringConfigWarningProps> = ({
  repository,
}) => {
  if (!repository || repository?.extensions?.scoringConfig?.id) {
    return <div />;
  }
  return (
    <Alert severity='warning'>
      <AlertTitle>Warning</AlertTitle>
      This repository has no scoring config. Without a scoring config, all files
      will have a weight of 1 when calculating scores.
    </Alert>
  );
};

export default ScoringConfigWarning;
