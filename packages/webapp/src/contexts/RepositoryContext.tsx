import React, { useContext, useState } from 'react';

interface RepositoryContextState {
  repositoryId: string;
  setRepositoryId: React.Dispatch<React.SetStateAction<string>>;
}

const repositoryContextDefault: RepositoryContextState = {
  repositoryId: '',
  setRepositoryId: () => null,
};

const RepositoryContext = React.createContext<RepositoryContextState>(
  repositoryContextDefault,
);

export function useRepositoryContext() {
  return useContext(RepositoryContext);
}

function useRepositoryState(): RepositoryContextState {
  const [repositoryId, setRepositoryId] = useState<string>('');
  return { repositoryId, setRepositoryId };
}

export const RepositoryContextProvider: React.FC = ({ children }) => {
  const value = useRepositoryState();
  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  );
};
