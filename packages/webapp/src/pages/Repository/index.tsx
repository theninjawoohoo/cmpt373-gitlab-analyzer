import React, { useEffect } from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import RepositoryList from '../../components/Repository';
import APIKeyModal from '../../components/APIKeyModal';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { useFilterContext } from '../../contexts/FilterContext';

const RepositoryPage: React.FC = () => {
  const { repositoryId, setRepositoryId } = useRepositoryContext();
  const { setAuthor, setEmail } = useFilterContext();
  useEffect(() => {
    setRepositoryId('');
    setAuthor('all');
    setEmail([]);
  }, [repositoryId]);
  return (
    <div>
      <DefaultPageLayout>
        <RepositoryList />
        <APIKeyModal />
      </DefaultPageLayout>
    </div>
  );
};

export default RepositoryPage;
