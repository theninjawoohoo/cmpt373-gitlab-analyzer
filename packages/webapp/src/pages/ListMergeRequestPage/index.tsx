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
import CommitOrMergeRequestRenderer from './components/CommitOrMergeRequestRenderer.tsx';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import styled from 'styled-components';
import { useFilterContext } from '../../contexts/FilterContext';
import { ScoreOverrideQueueProvider } from './contexts/ScoreOverrideQueue';
import ScoreOverrideQueueInfo from './components/ScoreOverrideQueueInfo';
import { useInfiniteCommit } from '../../api/commit';
import { DateTime } from 'luxon';

const IndependentScrollGrid = styled(Grid)`
  height: 100vh;
  position: fixed;
  margin-left: 5rem;
  padding-right: 8rem;
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

const CompactTableHeaders: React.FC = () => {
  return (
    <Box pr={6} pl={2} py={1}>
      <Grid container>
        <Grid item xs={8}>
          <Typography>Title</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography align='right'>Score</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography align='right'>Σ Commits</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const RegularTableHeaders: React.FC = () => {
  return (
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
        <Grid item xs={1}>
          <Typography>Score</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>Σ Commits</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const ListMergeRequestPage = () => {
  const { id } = useParams<{ id: string }>();
  const { startDate, endDate, emails } = useFilterContext();
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
  const {
    data: commits,
    fetchNextPage: fetchNextPageCommit,
    hasNextPage: hasNextPageCommit,
  } = useInfiniteCommit({
    repository: id,
    author_email: emails,
    start_date: startDate.toString(),
    end_date: endDate.toString(),
    not_associated_with_any_mr: true,
  });

  useEffect(() => {
    if (loadMoreInView) {
      void fetchNextPage();
      void fetchNextPageCommit();
    }
  }, [emails, loadMoreInView]);

  const reducedMergeRequests =
    mergeRequests?.pages?.reduce(
      (accumulated, current) => [...accumulated, ...current.results],
      [],
    ) || [];

  const reducedCommits =
    commits?.pages?.reduce(
      (accumulated, current) => [...accumulated, ...current.results],
      [],
    ) || [];

  const commitsAndMergeRequests = reducedCommits.concat(reducedMergeRequests);

  commitsAndMergeRequests.sort((a, b) => {
    if (a.meta.resourceType == 'MergeRequest') {
      a = DateTime.fromISO(a.merged_at);
    } else {
      a = DateTime.fromISO(a.committed_date);
    }
    if (b.meta.resourceType == 'MergeRequest') {
      b = DateTime.fromISO(b.merged_at);
    } else {
      b = DateTime.fromISO(b.committed_date);
    }
    return b - a;
  });

  const GridComponent = activeMergeRequest ? IndependentScrollGrid : Grid;
  return (
    <>
      <DefaultPageLayout>
        <ScoreOverrideQueueProvider>
          <GridComponent container spacing={activeMergeRequest ? 3 : 0}>
            <Grid item xs={activeMergeRequest ? 5 : 12}>
              <Container>
                <ScoreOverrideQueueInfo />
                <Box my={2}>
                  <DefaultPageTitleFormat>
                    Merge Requests
                  </DefaultPageTitleFormat>
                </Box>
                {!activeMergeRequest ? (
                  <RegularTableHeaders />
                ) : (
                  <CompactTableHeaders />
                )}
                {commitsAndMergeRequests.map((commitOrMergeRequest) => {
                  const active =
                    commitOrMergeRequest.meta.id ===
                    activeMergeRequest?.meta.id;
                  if (
                    commitOrMergeRequest.meta.resourceType == 'MergeRequest'
                  ) {
                    return (
                      <CommitOrMergeRequestRenderer
                        key={commitOrMergeRequest.meta.id}
                        mergeRequest={commitOrMergeRequest}
                        active={active}
                        shrink={!!activeMergeRequest}
                        onClickSummary={() => {
                          setActiveCommit(undefined);
                          setActiveMergeRequest(
                            active ? undefined : commitOrMergeRequest,
                          );
                        }}
                      >
                        {active && (
                          <CommitList
                            mergeRequest={commitOrMergeRequest}
                            activeCommit={activeCommit}
                            setActiveCommit={setActiveCommit}
                            authorEmails={emails}
                          />
                        )}
                      </CommitOrMergeRequestRenderer>
                    );
                  } else {
                    return (
                      <CommitOrMergeRequestRenderer
                        key={commitOrMergeRequest.meta.id}
                        commit={commitOrMergeRequest}
                        active={active}
                        shrink={!!activeMergeRequest}
                        onClickSummary={() => {
                          setActiveCommit(commitOrMergeRequest);
                          setActiveMergeRequest(
                            active ? undefined : commitOrMergeRequest,
                          );
                        }}
                      />
                    );
                  }
                })}
                {hasNextPage && hasNextPageCommit && (
                  <LoadMore
                    onClick={() => {
                      void fetchNextPage();
                      void fetchNextPageCommit();
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
        </ScoreOverrideQueueProvider>
      </DefaultPageLayout>
    </>
  );
};

export default ListMergeRequestPage;
