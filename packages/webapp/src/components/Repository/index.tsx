import { Operation } from '@ceres/types';
import React, { useEffect, useState } from 'react';
import {
  useFetchRepositories,
  useGetOperations,
  useSyncRepository,
} from '../../api/operation';
import { useRepository } from '../../api/repository';
import { ProgressCircle } from '../Common/CircularProgress';
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

function hasPendingSync(operations: Operation[], id: string) {
  return (
    operations.filter((operation) => operation.input.repository_id === id)
      .length > 0
  );
}

const Repository: React.FC = () => {
  const { data: asc_repos } = useRepository({ sort: '+project_synced' });
  const { data: desc_repos } = useRepository({ sort: '-project_synced' });
  let repos = desc_repos;
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
  const [orderState, setOrder] = useState('DESC');

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

  useEffect(() => {
    if (orderState === 'DESC') {
      console.log('in!');
      repos = desc_repos;
    } else {
      console.log('out');
      repos = asc_repos;
    }
    console.log(repos);
  }, [repos, orderState]);

  const handleChange = (e) => {
    console.log('now', orderState);
    console.log('target', e.target.value);
    setOrder(e.target.value as string);
    console.log('this', repos);
  };

  return (
    <Container>
      <Grid container justify='space-between' alignItems='center'>
        <Grid item>
          <DefaultPageTitleFormat>Projects</DefaultPageTitleFormat>
        </Grid>
        <Grid item>
          <input
            style={{ minWidth: '15rem', minHeight: '3rem', fontSize: '20px' }}
            key='random1'
            // value={keyword}
            placeholder={'not implemented yet search'}
            // onChange={(e) => setKeyword(e.target.value)}
          />
        </Grid>
        <Grid item>
          <FormControl variant='filled'>
            <InputLabel shrink id='sort-order-label'>
              Select sort order:
            </InputLabel>
            <Select
              labelId='sort-order-label'
              id='sort-order-label-options'
              value={orderState}
              onChange={handleChange}
              style={{ minWidth: '15rem' }}
            >
              <MenuItem value='DESC'>Recently Synced</MenuItem>
              <MenuItem value='ASC'>Oldest Synced</MenuItem>
            </Select>
          </FormControl>
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
      <React.Fragment>
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
      </React.Fragment>
    </Container>
  );
};

export default Repository;
