import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import MergeRequestDiffLayout from '../../components/MergeRequests';

const RepositoryPage: React.FC = () => {
  return (
    <div>
      <DefaultPageLayout>
        <MergeRequestDiffLayout />
      </DefaultPageLayout>
    </div>
  );
};

export default RepositoryPage;
