import React from 'react';
import { Button } from '@material-ui/core';
import { useCommitsForMergeRequest } from '../../api/commit';

const MergeRequestCommitList: React.FC = () => {
  const { data: commitData } = useCommitsForMergeRequest(
    '25e79a66-ac8e-4735-8858-9025aacd0dcf',
  );
  console.log(commitData);
  return <Button />;
};

export default MergeRequestCommitList;
