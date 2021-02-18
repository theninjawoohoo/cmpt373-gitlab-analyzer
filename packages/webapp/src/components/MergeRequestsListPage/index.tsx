import React from 'react';
import MergeRequestsTable from '../../components/MergeRequestsTable';
import StudentDropdownMenu from '../../components/DropdownMenu';

const MergeRequestsList = () => {
  return (
    <>
      <div style={{ float: 'right' }}>
        <StudentDropdownMenu />
      </div>
      <div>
        <MergeRequestsTable />
      </div>
    </>
  );
};

export default MergeRequestsList;
