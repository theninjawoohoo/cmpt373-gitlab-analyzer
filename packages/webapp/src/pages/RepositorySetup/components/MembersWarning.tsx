import { Commit } from '@ceres/types';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useRepositoryAuthors } from '../../../api/author';
// import { Button } from '@material-ui/core';
// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

interface MembersWarningProps {
  repositoryId: string;
}

function countOrphanAuthors(authors: Commit.Author[]) {
  return authors.filter((author) => !author.repository_member_id).length;
}

const MembersWarning: React.FC<MembersWarningProps> = ({ repositoryId }) => {
  const { data } = useRepositoryAuthors(repositoryId);
  const orphanCount = countOrphanAuthors(data || []);
  if (orphanCount === 0) {
    return <div />;
  }
  return (
    <Alert
      severity='warning'
      // action={
      //   <Button
      //     variant='text'
      //     color='inherit'
      //     endIcon={<ArrowForwardIosIcon />}
      //     href={`/setup/${repositoryId}/members`}
      //   >
      //     Link members
      //   </Button>
      // }
    >
      There are <strong>{orphanCount}</strong> commit authors that are not
      linked to a repository member.
    </Alert>
  );
};

export default MembersWarning;
