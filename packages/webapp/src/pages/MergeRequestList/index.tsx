import React from 'react';
import MergeRequestsTable from '../../components/MergeRequestsTable';
import StudentDropdownMenu from '../../components/DropdownMenu';
import DefaultPageLayout from '../../components/DefaultPageLayout';

const MergeRequestsListPage = () => {
  return (
    <>
      <DefaultPageLayout>
        <div>
          <div style={{ float: 'right' }}>
            <StudentDropdownMenu />
          </div>
          <div>
            <MergeRequestsTable />
          </div>
        </div>
      </DefaultPageLayout>
    </>
  );
};

export default MergeRequestsListPage;
