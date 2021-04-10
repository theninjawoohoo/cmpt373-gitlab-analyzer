import { GlobWeight } from '@ceres/types';
import React, { useContext, useState } from 'react';

interface RepositoryScoringState {
  showDrawer?: boolean;
  setShowDrawer: (showDrawer: boolean) => void;
  overrides?: GlobWeight[];
  setOverrides: (weights: GlobWeight[]) => void;
  showCurrentConfig?: boolean;
  setShowCurrentConfig: (showCurrentConfig: boolean) => void;
}

const repositoryScoringDefaultState: RepositoryScoringState = {
  overrides: [],
  setShowDrawer: () => null,
  setOverrides: () => null,
  setShowCurrentConfig: () => null,
};

const RepositoryScoringContext = React.createContext<RepositoryScoringState>(
  repositoryScoringDefaultState,
);

function useRepositoryScoringState(): RepositoryScoringState {
  const [overrides, setOverrides] = useState<GlobWeight[]>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showCurrentConfig, setShowCurrentConfig] = useState<boolean>(false);

  return {
    overrides,
    setOverrides,
    showDrawer,
    setShowDrawer,
    showCurrentConfig,
    setShowCurrentConfig,
  };
}

export function useRepositoryScoringContext() {
  return useContext(RepositoryScoringContext);
}

export const RepositoryScoringContextProvider: React.FC = ({ children }) => {
  const value = useRepositoryScoringState();
  return (
    <RepositoryScoringContext.Provider value={value}>
      {children}
    </RepositoryScoringContext.Provider>
  );
};
