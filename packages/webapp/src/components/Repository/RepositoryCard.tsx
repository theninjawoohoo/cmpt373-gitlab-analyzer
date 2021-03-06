import { Repository } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { ApiResource } from '../../api/base';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import UndecoratedLink from '../UndecoratedLink';

interface RepositoryCardProps {
  repository: ApiResource<Repository>;
  isSyncing: boolean;
  syncRepository: (id: string) => void;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  isSyncing,
  syncRepository,
}) => {
  const { setRepositoryId } = useRepositoryContext();
  const handleClick = () => {
    setRepositoryId(repository.meta.id);
  };
  return (
    <Box my={3} position='relative'>
      <UndecoratedLink
        onClick={handleClick}
        to={`/merge/${repository.meta.id}`}
      >
        <Box component={Paper} p={3} bgcolor='#F3FCFF'>
          <Grid container justify='space-between' alignItems='center'>
            <Grid item>
              <Grid alignItems='center' spacing={5} container>
                <Grid item>
                  <Box height='5rem' width='5rem' bgcolor='#DBD6FF' />
                </Grid>
                <Grid item>
                  <Typography variant='h4'>
                    {repository.namespace.path} /{' '}
                    <strong>{repository.name}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid alignItems='center' spacing={5} container>
                <Grid item />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </UndecoratedLink>
      <Box position='absolute' right='4rem' top='3rem'>
        {!isSyncing && (
          <Button
            variant='contained'
            color='secondary'
            disabled={isSyncing}
            onClick={() => syncRepository(repository.meta.id)}
          >
            Sync
          </Button>
        )}
      </Box>
      {isSyncing && (
        <Box
          position='absolute'
          zIndex={100}
          top='0'
          left='0'
          bottom='0'
          right='0'
          bgcolor='rgba(0, 0, 0, 0.3)'
        >
          <Box position='relative'>
            <Box position='absolute' top='3.5rem' left='50%'>
              <CircularProgress size={25} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RepositoryCard;
