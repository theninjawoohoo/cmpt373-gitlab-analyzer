import React, { useEffect } from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import RepositoryList from '../../components/Repository';
import APIKeyModal from '../../components/APIKeyModal';
import { useRepositoryContext } from '../../contexts/RepositoryContext';

const RepositoryPage: React.FC = () => {
  const { repositoryId, setRepositoryId } = useRepositoryContext();
  useEffect(() => {
    setRepositoryId('');
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
