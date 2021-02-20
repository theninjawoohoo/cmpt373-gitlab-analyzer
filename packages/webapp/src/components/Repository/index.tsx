import { Operation } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { useGetOperations, useSyncRepository } from '../../api/operation';
import { useRepository, usePostRepository } from '../../api/repository';
import { ProgressCircle } from '../Common/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RepositoryCard from './RepositoryCard';

function hasPendingSync(operations: Operation[], id: string) {
  return (
    operations.filter((operation) => operation.input.repository_id === id)
      .length > 0
  );
}

const Repository: React.FC = () => {
  const { data: repos } = useRepository();
  const { mutate } = usePostRepository();
  const {
    data: operationsData,
    invalidate: invalidateOperations,
  } = useGetOperations({
    status: [Operation.Status.PROCESSING, Operation.Status.PENDING],
    type: [Operation.Type.SYNC_REPOSITORY],
  });
  const { sync } = useSyncRepository();
  const openCircularProgress = false;
  const progress = 0;

  useEffect(() => {
    mutate(null);
  }, []);
  const syncRepository = (id: string) => {
    sync(id, {
      onSuccess: () => {
        void invalidateOperations();
      },
    });
  };
  const message =
    repos?.results.length == 0 ? (
      <h3>You have no repositories on your profile</h3>
    ) : null;

  return (
    <Container>
      <Box my={4}>
        <Grid container justify='space-between' alignItems='center'>
          <Grid item>
            <Typography variant='h1'>Projects</Typography>
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary' size='large'>
              Fetch
            </Button>
          </Grid>
        </Grid>
      </Box>
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
