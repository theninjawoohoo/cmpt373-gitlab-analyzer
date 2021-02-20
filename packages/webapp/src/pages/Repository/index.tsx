import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import Repository from '../../components/Repository';
import APIKeyModal from '../../components/APIKeyModal';

const RepositoryPage: React.FC = () => {
  return (
    <div>
      <DefaultPageLayout>
        <Repository />
        <APIKeyModal />
      </DefaultPageLayout>
    </div>
  );
};

export default RepositoryPage;
