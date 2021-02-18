import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import Repository from '../../components/DefaultPageLayout/Repository';
import APIKeyModal from '../../components/DefaultPageLayout/APIKeyModal';

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
