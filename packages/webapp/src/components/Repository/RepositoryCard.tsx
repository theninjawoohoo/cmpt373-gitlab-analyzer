import { Repository } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
import { ApiResource } from '../../api/base';
import { useRepositoryContext } from '../../contexts/RepositoryContext';

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
    <Box component={Paper} my={3} p={3} bgcolor='#F3FCFF'>
      <Grid container justify='space-between' alignItems='center'>
        <Grid item>
          <Grid alignItems='center' spacing={5} container>
            <Grid item>
              <Box height='5rem' width='5rem' bgcolor='#DBD6FF' />
            </Grid>
            <Grid item>
              <Typography variant='h4'>
                {repository.namespace.path} / <strong>{repository.name}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid alignItems='center' spacing={5} container>
            <Grid item>
              <Button
                variant='contained'
                color='secondary'
                disabled={isSyncing}
                component={Link}
                onClick={handleClick}
                to={`/merge/${repository.meta.id}`}
              >
                View
              </Button>
            </Grid>
            <Grid item>
              <Box position='relative'>
                <Button
                  variant='contained'
                  color='secondary'
                  disabled={isSyncing}
                  onClick={() => syncRepository(repository.meta.id)}
                >
                  Sync
                </Button>
                {isSyncing && (
                  <Box position='absolute' top='.5rem' left='1.25rem'>
                    <CircularProgress size={25} />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RepositoryCard;
