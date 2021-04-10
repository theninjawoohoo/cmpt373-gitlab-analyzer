import { Repository } from '@ceres/types';
import Alert from '@material-ui/lab/Alert';
import { isEqual } from 'lodash';
import React from 'react';
import { useRepositoryScoringContext } from '../RepositoryScoringContext';

interface ScoringConfigOverrideWarningProps {
  repository?: Repository;
}

const ScoringConfigOverrideWarning: React.FC<ScoringConfigOverrideWarningProps> = ({
  repository,
}) => {
  const { overrides } = useRepositoryScoringContext();
  if (
    !repository ||
    isEqual(repository?.extensions?.scoringConfig?.overrides, overrides)
  ) {
    return null;
  }
  return (
    <Alert severity='warning'>
      You have pending scoring config override changes. These changes will not
      be saved until you re-evaluate this repository snapshot.
    </Alert>
  );
};

export default ScoringConfigOverrideWarning;
