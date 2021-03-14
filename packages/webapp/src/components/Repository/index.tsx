import { Operation } from '@ceres/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import {
  useFetchRepositories,
  useGetOperations,
  useSyncRepository,
} from '../../api/operation';
import { useRepository } from '../../api/repository';
import { ProgressCircle } from '../Common/CircularProgress';
import RepositoryCard from './RepositoryCard';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import { CircularProgress, Select, InputLabel } from '@material-ui/core';
import {
  FormControl,
  MenuItem,
  Button,
  Container,
  Box,
  Grid,
} from '@material-ui/core';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [descending, setDesc] = useState('ASC');

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

  // useEffect(()=>{
  //   if (descending === 'DESC'){
  //
  //   } else {
  //
  //   }
  // }

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
            placeholder={'search repository name'}
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
              value={descending}
              onChange={(e) => {
                e.preventDefault();
                setDesc(e.target.value as string);
              }}
              style={{ minWidth: '15rem' }}
            >
              <MenuItem value='ASC'>ascending</MenuItem>
              <MenuItem value='DESC'>descending</MenuItem>
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
