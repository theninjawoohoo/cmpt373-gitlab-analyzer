import { Operation } from '@ceres/types';
import React, { useState } from 'react';
import {
  useFetchRepositories,
  useGetOperations,
  useSyncRepository,
} from '../../api/operation';
import { useRepository } from '../../api/repository';
import RepositoryCard from './RepositoryCard';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import { TextField } from '@material-ui/core';

function hasPendingSync(operations: Operation[], id: string) {
  return (
    operations.filter((operation) => operation.input.repository_id === id)
      .length > 0
  );
}

const Repository: React.FC = () => {
  const [sort, setSort] = useState('-project_created');
  const [search, setSearch] = useState('');
  const { data } = useRepository({ sort, name: search });
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
    data?.results.length == 0 ? (
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
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            label='Search'
            variant='outlined'
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl variant='filled' fullWidth>
            <InputLabel shrink id='sort-order-label'>
              Sort
            </InputLabel>
            <Select
              labelId='sort-order-label'
              id='sort-order-label-options'
              value={sort}
              onChange={(e) => setSort(e.target.value as string)}
              style={{ minWidth: '15rem' }}
              fullWidth
            >
              <MenuItem value='-project_synced'>Recently Synced</MenuItem>
              <MenuItem value='+project_synced'>Oldest Synced</MenuItem>
              <MenuItem value='-project_created'>Recently Created</MenuItem>
              <MenuItem value='+project_created'>Oldest Created</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {message}
      <React.Fragment>
        {data?.results.map((repo) => {
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
      </React.Fragment>
    </Container>
  );
};

export default Repository;
