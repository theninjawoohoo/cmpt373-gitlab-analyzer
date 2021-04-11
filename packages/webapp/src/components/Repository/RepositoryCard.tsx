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
import SmartDate from '../SmartDate';
import UndecoratedLink from '../UndecoratedLink';
import WarningIcon from '@material-ui/icons/Warning';
import ShareIcon from '@material-ui/icons/Share';

interface RepositoryCardProps {
  repository: ApiResource<Repository>;
  isShared: boolean;
  isSyncing: boolean;
  syncRepository: (id: string) => void;
}

const SyncButton = (props: { syncing: boolean; onClick: () => void }) => (
  <Box position='absolute' right='4rem' top='3rem'>
    {!props.syncing && (
      <Button
        variant='contained'
        color='secondary'
        disabled={props.syncing}
        onClick={props.onClick}
      >
        Sync
      </Button>
    )}
  </Box>
);
// https://medium.com/@pppped/compute-an-arbitrary-color-for-user-avatar-starting-from-his-username-with-javascript-cd0675943b66
const generateColor = (
  repoName: string,
  saturation: number,
  lightness: number,
) => {
  let hash = 0;
  for (let i = 0; i < repoName.length; i++) {
    hash = repoName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return 'hsl(' + h + ', ' + saturation + '%, ' + lightness + '%)';
};

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  isShared,
  isSyncing,
  syncRepository,
}) => {
  const { setRepositoryId } = useRepositoryContext();
  const hasBeenSynced = !!repository?.extensions?.lastSync;
  const handleClick = () => {
    setRepositoryId(repository.meta.id);
  };
  const collaboratorsCount = repository?.extensions?.collaborators?.length || 0;
  return (
    <Box my={3} position='relative'>
      <UndecoratedLink
        onClick={handleClick}
        to={hasBeenSynced ? `/setup/${repository.meta.id}` : undefined}
      >
        <Box component={Paper} p={3} bgcolor='#F3FCFF'>
          <Grid container justify='space-between' alignItems='center'>
            <Grid item>
              <Grid alignItems='center' spacing={5} container>
                <Grid item>
                  <Box
                    height='5rem'
                    width='5rem'
                    bgcolor={generateColor(repository.name, 30, 60)}
                  />
                </Grid>
                <Grid item>
                  {isShared && (
                    <Typography variant='body2'>
                      Shared by:{' '}
                      <strong>{repository?.extensions?.owner?.display}</strong>
                    </Typography>
                  )}
                  {!isShared && collaboratorsCount > 0 && (
                    <Grid alignItems='center' container spacing={1}>
                      <Grid item>
                        <ShareIcon fontSize='inherit' />
                      </Grid>
                      <Grid item>
                        <Typography variant='body2'>
                          Shared with <strong>{collaboratorsCount}</strong>{' '}
                          users
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  <Grid alignItems='center' container>
                    {!hasBeenSynced && <Box component={WarningIcon} mr={2} />}
                    <Typography variant='h4'>
                      {repository.namespace.path} /{' '}
                      <strong>{repository.name}</strong>
                    </Typography>
                  </Grid>
                  {hasBeenSynced && (
                    <Typography variant='body2'>
                      Last Synced:{' '}
                      <SmartDate>{repository?.extensions?.lastSync}</SmartDate>
                    </Typography>
                  )}
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
      {!isShared && (
        <SyncButton
          syncing={isSyncing}
          onClick={() => syncRepository(repository.meta.id)}
        />
      )}
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
