import { Commit, MergeRequest } from '@ceres/types';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'react-router-dom';
import { ApiResource } from '../../api/base';
import { useInfiniteMergeRequest } from '../../api/mergeRequests';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import Container from '@material-ui/core/Container';
import LoadMore from '../../components/LoadMore';
import CodeView from './components/CodeView';
import CommitList from './components/CommitList';
import MergeRequestRenderer from './components/MergeRequestRenderer';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import styled from 'styled-components';
import { useFilterContext } from '../../contexts/FilterContext';

const IndependentScrollGrid = styled(Grid)`
  height: 100vh;
  position: fixed;
  margin-left: 5rem;
  padding-right: 6rem;
  & > * {
    height: 100vh;
    overflow: hidden;

    & > * {
      // hack to hide scrollbar: https://stackoverflow.com/questions/16670931/hide-scroll-bar-but-while-still-being-able-to-scroll
      padding-right: 30px;
      height: 100vh;
      width: 100%;
      overflow-y: scroll;
      box-sizing: content-box;
    }
  }
`;

const ListMergeRequestPage = () => {
  const { id } = useParams<{ id: string }>();
  const { startDate, endDate, emails } = useFilterContext();
  console.log(emails);
  const [activeMergeRequest, setActiveMergeRequest] = useState<
    ApiResource<MergeRequest>
  >();
  const [activeCommit, setActiveCommit] = useState<ApiResource<Commit>>();
  const { ref: loadMoreRef, inView: loadMoreInView } = useInView();
  const {
    data: mergeRequests,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteMergeRequest({
    repository: id,
    author_email: emails,
    merged_start_date: startDate.toString(),
    merged_end_date: endDate.toString(),
  });

  useEffect(() => {
    if (loadMoreInView) {
      void fetchNextPage();
    }
  }, [emails, loadMoreInView]);

  const reducedMergeRequests =
    mergeRequests?.pages?.reduce(
      (accumulated, current) => [...accumulated, ...current.results],
      [],
    ) || [];
  const GridComponent = activeMergeRequest ? IndependentScrollGrid : Grid;
  return (
    <>
      <DefaultPageLayout>
        <GridComponent container spacing={activeMergeRequest ? 3 : 0}>
          <Grid item xs={activeMergeRequest ? 5 : 12}>
            <Container>
              <Box my={2}>
                <DefaultPageTitleFormat>Merge Requests</DefaultPageTitleFormat>
              </Box>
              {!activeMergeRequest && (
                <Box pr={6} pl={2} py={1}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Title</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>Author</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>Date</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>Score</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {reducedMergeRequests.map((mergeRequest) => {
                const active =
                  mergeRequest.meta.id === activeMergeRequest?.meta.id;
                return (
                  <MergeRequestRenderer
                    key={mergeRequest.meta.id}
                    mergeRequest={mergeRequest}
                    active={active}
                    shrink={!!activeMergeRequest}
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
                        authorEmails={emails}
                      />
                    )}
                  </MergeRequestRenderer>
                );
              })}
              {hasNextPage && (
                <LoadMore
                  onClick={() => {
                    void fetchNextPage();
                  }}
                  ref={loadMoreRef}
                />
              )}
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
        </GridComponent>
      </DefaultPageLayout>
    </>
  );
};

export default ListMergeRequestPage;
