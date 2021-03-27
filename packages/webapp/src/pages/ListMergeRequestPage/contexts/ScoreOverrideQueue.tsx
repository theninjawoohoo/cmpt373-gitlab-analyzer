import { ScoreOverride } from '@ceres/types';
import React, { useContext, useState } from 'react';

interface StagedScoreOverride {
  id: string;
  display: string;
  override: ScoreOverride;
}

interface ScoreOverrideQueueState {
  queue: StagedScoreOverride[];
  add: (value: StagedScoreOverride) => void;
  remove: (id: string) => void;
}

const scoreOverrideDefault: ScoreOverrideQueueState = {
  queue: [],
  add: () => null,
  remove: () => null,
};

const ScoreOverrideQueue = React.createContext<ScoreOverrideQueueState>(
  scoreOverrideDefault,
);

function useScoreOverrideQueueState(): ScoreOverrideQueueState {
  const [queue, setQueue] = useState<StagedScoreOverride[]>([]);

  function add(value: StagedScoreOverride) {
    setQueue([...queue, value]);
  }

  function remove(id: string) {
    setQueue(queue.filter((override) => override.id !== id));
  }

  return {
    queue,
    add,
    remove,
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
