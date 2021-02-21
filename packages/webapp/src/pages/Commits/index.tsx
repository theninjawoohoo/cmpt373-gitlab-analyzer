import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import CommitList from '../../components/CommitList';

const CommitsPage: React.FC = () => {
  return (
    <div>
      <DefaultPageLayout>
        <CommitList />
      </DefaultPageLayout>
    </div>
  );
};

export default CommitsPage;
