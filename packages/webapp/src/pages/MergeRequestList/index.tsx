import React from 'react';
import MergeRequestsTable from '../../components/MergeRequestsTable';
import DefaultPageLayout from '../../components/DefaultPageLayout';

const MergeRequestsListPage = () => {
  return (
    <>
      <DefaultPageLayout>
        <div>
          <MergeRequestsTable />
        </div>
      </DefaultPageLayout>
    </>
  );
};

export default MergeRequestsListPage;
