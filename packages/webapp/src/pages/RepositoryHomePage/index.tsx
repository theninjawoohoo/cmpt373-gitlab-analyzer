import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useGetRepository } from '../../api/repository';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import SmartDate from '../../components/SmartDate';
import CancelIcon from '@material-ui/icons/Cancel';
import LinkGrid from './components/LinkGrid';
import MembersWarning from './components/MembersWarning';
import Box from '@material-ui/core/Box';
import ScoringConfigWarning from './components/ScoringConfigWarning';
import ScoringConfigSelector from './components/ScoringConfigSelector';
import { useUpdateScoring } from '../../api/scoring';
import { ApiResource } from '../../api/base';
import { ScoringConfig } from '@ceres/types';

const RepositoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useHistory();
  const {
    mutate: updateScoring,
    isLoading: updateScoreLoading,
  } = useUpdateScoring();
  const { data, invalidate } = useGetRepository(id);

  const handleUpdateScore = (scoringConfig: ApiResource<ScoringConfig>) => {
    updateScoring(
      {
        repositoryId: id,
        scoringConfigId: scoringConfig?.meta?.id,
      },
      {
        onSuccess: () => {
          void invalidate();
        },
      },
    );
  };

  return (
    <DefaultPageLayout>
      <Container>
        <Grid container justify='space-between' alignItems='center'>
          <Grid item>
            <DefaultPageTitleFormat>
              {data?.name_with_namespace}
            </DefaultPageTitleFormat>
          </Grid>
          <Grid item>
            <IconButton onClick={() => push('/repository')}>
              <CancelIcon fontSize='large' />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>
              <strong>Created at:</strong>{' '}
              <SmartDate>{data?.created_at}</SmartDate>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Last synced:</strong>{' '}
              <SmartDate>{data?.extensions?.lastSync}</SmartDate>
            </Typography>
          </Grid>
        </Grid>
        <Box my={3}>
          <MembersWarning repositoryId={id} />
        </Box>
        <Box my={3}>
          <ScoringConfigWarning repository={data} />
        </Box>
        {data && (
          <Box my={3}>
            <ScoringConfigSelector
              isLoading={updateScoreLoading}
              onSubmit={handleUpdateScore}
              repository={data}
            />
          </Box>
        )}
        <LinkGrid repositoryId={id} />
      </Container>
    </DefaultPageLayout>
  );
};

export default RepositoryPage;
