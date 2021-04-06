import { StagedScoreOverride } from '@ceres/types';
import React, { useContext, useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';

interface ScoreOverrideQueueState {
  queue: StagedScoreOverride[];
  add: (value: StagedScoreOverride) => void;
  remove: (id: string) => void;
  reset: () => void;
}

const scoreOverrideDefault: ScoreOverrideQueueState = {
  queue: [],
  add: () => null,
  remove: () => null,
  reset: () => null,
};

const ScoreOverrideQueue = React.createContext<ScoreOverrideQueueState>(
  scoreOverrideDefault,
);

function useScoreOverrideQueueState(): ScoreOverrideQueueState {
  const [queue, setQueue] = useState<StagedScoreOverride[]>([]);
  const { user } = useAuthContext();

  function add(value: StagedScoreOverride) {
    value.override.user = {
      id: user.id,
      display: user.sfuId,
    };
    setQueue([...queue.filter((override) => override.id !== value.id), value]);
  }

  function remove(id: string) {
    setQueue(queue.filter((override) => override.id !== id));
  }

  function reset() {
    setQueue([]);
  }

  return {
    queue,
    add,
    remove,
    reset,
  };
}

export function useScoreOverrideQueue() {
  return useContext(ScoreOverrideQueue);
}

export const ScoreOverrideQueueProvider: React.FC = ({ children }) => {
  const value = useScoreOverrideQueueState();
  return (
    <ScoreOverrideQueue.Provider value={value}>
      {children}
    </ScoreOverrideQueue.Provider>
  );
};
