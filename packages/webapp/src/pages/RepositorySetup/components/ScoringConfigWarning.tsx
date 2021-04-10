import { Repository } from '@ceres/types';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

interface ScoringConfigWarningProps {
  repository?: Repository;
  repositoryId: string;
}

const ScoringConfigWarning: React.FC<ScoringConfigWarningProps> = ({
  repository,
}) => {
  if (!repository || repository?.extensions?.scoringConfig?.id) {
    return null;
  }
  return (
    <Alert severity='warning'>
      This repository has no scoring rubric. Without a rubric, all files will
      have a weight of 1 when calculating scores.
    </Alert>
  );
};

export default ScoringConfigWarning;
