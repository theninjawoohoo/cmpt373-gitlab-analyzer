import { ScoringConfig } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import React from 'react';
import ScoringConfigForm from '../../../components/ScoringConfigForm';
import { useRepositoryScoringContext } from '../RepositoryScoringContext';

const ScoringConfigOverrides: React.FC = () => {
  const {
    showDrawer,
    setShowDrawer,
    overrides,
    setOverrides,
  } = useRepositoryScoringContext();

  function onSubmit(values: ScoringConfig) {
    const newOverrides = values?.weights || [];
    setOverrides(newOverrides);
    setShowDrawer(false);
  }

  return (
    <Drawer
      open={showDrawer}
      anchor='right'
      onClose={() => {
        setShowDrawer(false);
      }}
    >
      <Box p={2}>
        <ScoringConfigForm
          defaultValues={{ weights: overrides }}
          onSubmit={onSubmit}
        />
      </Box>
    </Drawer>
  );
};

export default ScoringConfigOverrides;
