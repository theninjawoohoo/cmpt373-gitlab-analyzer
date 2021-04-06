import { Repository } from '@ceres/types';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

interface ScoringConfigWarningProps {
  repository?: Repository;
  repositoryId: string;
}

const ScoringConfigWarning: React.FC<ScoringConfigWarningProps> = ({
  repository,
  repositoryId,
}) => {
  if (!repository || repository?.extensions?.scoringConfig?.id) {
    return <div />;
  }
  return (
    <Alert
      severity='warning'
      action={
        <Button
          variant='text'
          color='inherit'
          endIcon={<ArrowForwardIosIcon />}
          href={`/setup/${repositoryId}/rubric`}
        >
          Set rubric
        </Button>
      }
    >
      This repository has no scoring rubric. Without a rubric, all files will
      have a weight of 1 when calculating scores.
    </Alert>
  );
};

export default ScoringConfigWarning;
