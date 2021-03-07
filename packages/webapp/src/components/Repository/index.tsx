import { Operation } from '@ceres/types';
import React from 'react';
import {
  useFetchRepositories,
  useGetOperations,
  useSyncRepository,
} from '../../api/operation';
import { useRepository } from '../../api/repository';
import { ProgressCircle } from '../Common/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RepositoryCard from './RepositoryCard';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

function hasPendingSync(operations: Operation[], id: string) {
  return (
    operations.filter((operation) => operation.input.repository_id === id)
      .length > 0
  );
}

const Repository: React.FC = () => {
  const { data: repos } = useRepository();
  const {
    data: operationsData,
    invalidate: invalidateOperations,
  } = useGetOperations({
    status: [Operation.Status.PROCESSING, Operation.Status.PENDING],
    type: [Operation.Type.SYNC_REPOSITORY],
  });
  const {
    data: pendingFetches,
    invalidate: invalidatePendingFetches,
  } = useGetOperations({
    status: [Operation.Status.PROCESSING, Operation.Status.PENDING],
    type: [Operation.Type.FETCH_REPOSITORIES],
  });
  const { sync } = useSyncRepository();
  const { fetch } = useFetchRepositories();
  const openCircularProgress = false;
  const progress = 0;
  const isFetchingRepositories = pendingFetches?.total > 0;

  const syncRepository = (id: string) => {
    sync(id, {
      onSuccess: () => {
        void invalidateOperations();
      },
    });
  };
  const fetchRepositories = () => {
    fetch({
      onSuccess: () => {
        void invalidatePendingFetches();
      },
    });
  };

  const message =
    repos?.results.length == 0 ? (
      <h3>You have no repositories on your profile</h3>
    ) : null;

  return (
    <Container>
      <Grid container justify='space-between' alignItems='center'>
        <Grid item>
          <DefaultPageTitleFormat>Projects</DefaultPageTitleFormat>
        </Grid>
        <Grid item>
          <Box position='relative'>
            <Button
              variant='contained'
              color='primary'
              size='large'
              onClick={fetchRepositories}
              disabled={isFetchingRepositories}
            >
              Fetch
            </Button>
            {isFetchingRepositories && (
              <Box position='absolute' top='.25rem' left='1.5rem'>
                <CircularProgress color='secondary' />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      {message}
      {openCircularProgress && <ProgressCircle progress={progress} />}
      {repos?.results.map((repo) => {
        const isSyncing = hasPendingSync(
          operationsData?.results || [],
          repo.meta.id,
        );
        return (
          <RepositoryCard
            repository={repo}
            isSyncing={isSyncing}
            syncRepository={syncRepository}
            key={repo.meta.id}
          />
        );
      })}
    </Container>
  );
};

export default Repository;
