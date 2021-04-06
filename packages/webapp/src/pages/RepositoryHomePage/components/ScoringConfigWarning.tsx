import { Repository } from '@ceres/types';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import React from 'react';
import ShortcutButton from './ShortcutButton';

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
        <ShortcutButton link={`/setup/${repositoryId}/rubric`}>
          Set rubric
        </ShortcutButton>
      }
    >
      <AlertTitle>Warning</AlertTitle>
      This repository has no scoring rubric. Without a rubric, all files will
      have a weight of 1 when calculating scores.
    </Alert>
  );
};

export default ScoringConfigWarning;
