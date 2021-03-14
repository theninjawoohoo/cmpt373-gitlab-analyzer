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
import MemberDropdown from '../../components/MemberDropdown';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import CalendarFilter from '../../components/CalendarFilter';
import { useFilterContext } from '../../contexts/FilterContext';

const ListMergeRequestPage = () => {
  const { id } = useParams<{ id: string }>();
  const { startDate, endDate } = useFilterContext();
  const { repositoryId } = useRepositoryContext();
  const [emails, setEmails] = useState<string[]>([]);
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
    console.log(emails);
    if (loadMoreInView) {
      void fetchNextPage();
    }
  }, [emails, loadMoreInView]);

  const reducedMergeRequests =
    mergeRequests?.pages?.reduce(
      (accumulated, current) => [...accumulated, ...current.results],
      [],
    ) || [];
  return (
    <>
      <DefaultPageLayout>
        <Grid container>
          <Grid item xs={activeMergeRequest ? 5 : 12}>
            <Container>
              <Box my={2}>
                <DefaultPageTitleFormat>Merge Requests</DefaultPageTitleFormat>
              </Box>
              <Grid item>
                <MemberDropdown
                  repositoryId={repositoryId}
                  onChange={(newEmails) => {
                    setEmails(newEmails);
                  }}
                />
                <CalendarFilter />
              </Grid>
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
              {reducedMergeRequests.map((mergeRequest) => {
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
                        authorEmails={emails}
                      />
                    )}
                  </MergeRequestRenderer>
                );
              })}
            </Container>
            {hasNextPage && (
              <LoadMore
                onClick={() => {
                  void fetchNextPage();
                }}
                ref={loadMoreRef}
              />
            )}
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
