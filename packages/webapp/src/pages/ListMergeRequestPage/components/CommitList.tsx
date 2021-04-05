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
  border-top: 1px solid #e0e0e0;
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
      <Box pr={3}>
        <Typography align='right'>Commit Score</Typography>
      </Box>
      {(commits?.results || []).map((commit) => {
        const isActive =
          authorEmails.length === 0 ||
          authorEmails.includes(commit.author_email);
        return (
          <Root
            key={commit.meta.id}
            ml={5}
            pr={3}
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
                <Typography>{commit.title}</Typography>
                <Grid container justify='space-between'>
                  <Typography variant='body2' color='textSecondary'>
                    {commit.author_name}
                  </Typography>
                  <Box pr={5}>
                    <Typography variant='body2' color='textSecondary'>
                      <SmartDate>{commit.authored_date}</SmartDate>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Typography align='right'>
                  {commit.extensions?.score?.toFixed(1)}
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
