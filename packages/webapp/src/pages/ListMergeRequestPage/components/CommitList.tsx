import { Commit, MergeRequest } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import { ApiResource } from '../../../api/base';
import { useGetCommits } from '../../../api/commit';
import SmartDate from '../../../components/SmartDate';

interface CommitListProps {
  mergeRequest: ApiResource<MergeRequest>;
  activeCommit?: ApiResource<Commit>;
  setActiveCommit: (commit: ApiResource<Commit>) => void;
  authorEmails: string[];
}

const Root = styled(Box)<{ disabled?: boolean }>`
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
  opacity: ${(o) => (o.disabled ? '50%' : '100%')};
`;

const CommitList: React.FC<CommitListProps> = ({
  mergeRequest,
  activeCommit,
  setActiveCommit,
  authorEmails,
}) => {
  const { data: commits } = useGetCommits({
    merge_request: mergeRequest.meta.id,
  });
  return (
    <>
      {(commits?.results || []).map((commit) => {
        const isActive =
          authorEmails.length === 0 ||
          authorEmails.includes(commit.author_email);
        return (
          <Root
            key={commit.meta.id}
            pl={5}
            py={1}
            onClick={
              !isActive
                ? () => {
                    console.log('Invalid selection');
                  }
                : () => setActiveCommit(commit)
            }
            bgcolor={activeCommit?.meta.id === commit.meta.id ? '#D3D3D3' : ''}
            disabled={!isActive}
          >
            <Grid container>
              <Grid item xs={9}>
                <Typography variant='body2'>{commit.title}</Typography>
                <Typography>
                  <strong>Score:</strong> {commit.extensions?.score?.toFixed(1)}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant='body2'>{commit.author_name}</Typography>
                <Typography variant='body2'>
                  <SmartDate>{commit.authored_date}</SmartDate>
                </Typography>
              </Grid>
            </Grid>
          </Root>
        );
      })}
    </>
  );
};

export default CommitList;
