import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import MergeRequestCommitList from '../../components/MergeRequestCommitList';

const RepositoryPage: React.FC = () => {
  return (
    <div>
      <DefaultPageLayout>
        <MergeRequestCommitList />
      </DefaultPageLayout>
    </div>
  );
};

export default RepositoryPage;
