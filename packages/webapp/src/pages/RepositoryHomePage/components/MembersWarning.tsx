import { Commit } from '@ceres/types';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import React from 'react';
import { useRepositoryAuthors } from '../../../api/author';
import { Link } from 'react-router-dom';

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
    <Alert severity='warning'>
      <AlertTitle>Warning</AlertTitle>
      There are <strong>{orphanCount}</strong> commit authors that are not
      linked to a repository member. You can link members{' '}
      <Link to={`/repository/${repositoryId}/members`}>here</Link>.
    </Alert>
  );
};

export default MembersWarning;
