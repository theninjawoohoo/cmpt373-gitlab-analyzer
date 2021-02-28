import { Commit, MergeRequest } from '@ceres/types';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiResource } from '../../api/base';
import { useGetMergeRequests } from '../../api/mergeRequests';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import Container from '@material-ui/core/Container';
import CodeView from './components/CodeView';
import CommitList from './components/CommitList';
import MergeRequestRenderer from './components/MergeRequestRenderer';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const ListMergeRequestPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeMergeRequest, setActiveMergeRequest] = useState<
    ApiResource<MergeRequest>
  >();
  const [activeCommit, setActiveCommit] = useState<ApiResource<Commit>>();
  const { data: mergeRequests } = useGetMergeRequests({ repository: id });
  return (
    <>
      <DefaultPageLayout>
        <Grid container>
          <Grid item xs={activeMergeRequest ? 5 : 12}>
            <Container>
              <Box my={2}>
                <Typography variant='h1'>Merge Requests</Typography>
              </Box>
              <Box pr={6} pl={2} py={1}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Title</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Author</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Date</Typography>
                  </Grid>
                </Grid>
              </Box>
              {(mergeRequests?.results || []).map((mergeRequest) => {
                const active =
                  mergeRequest.meta.id === activeMergeRequest?.meta.id;
                return (
                  <MergeRequestRenderer
                    key={mergeRequest.meta.id}
                    mergeRequest={mergeRequest}
                    active={active}
                    onClickSummary={() => {
                      setActiveCommit(undefined);
                      setActiveMergeRequest(active ? undefined : mergeRequest);
                    }}
                  >
                    {active && (
                      <CommitList
                        mergeRequest={mergeRequest}
                        activeCommit={activeCommit}
                        setActiveCommit={setActiveCommit}
                      />
                    )}
                  </MergeRequestRenderer>
                );
              })}
            </Container>
          </Grid>
          {activeMergeRequest && (
            <Grid item xs={7}>
              <CodeView
                mergeRequest={activeMergeRequest}
                commit={activeCommit}
              />
            </Grid>
          )}
        </Grid>
      </DefaultPageLayout>
    </>
  );
};

export default ListMergeRequestPage;
