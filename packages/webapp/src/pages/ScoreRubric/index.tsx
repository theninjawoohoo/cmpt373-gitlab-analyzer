import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useHistory, useParams } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useGetRepository } from '../../api/repository';
import ScoringConfigSelector from '../RepositoryHomePage/components/ScoringConfigSelector';
import { ApiResource } from '../../api/base';
import { useUpdateScoring } from '../../api/scoring';
import { ScoringConfig } from '@ceres/types';
import { IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

const ScoreRubricPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const { data, invalidate } = useGetRepository(id);
  const isOwner = user?.id === data?.extensions?.owner?.id;
  const {
    mutate: updateScoring,
    isLoading: updateScoreLoading,
  } = useUpdateScoring();
  const { push } = useHistory();

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
    <div>
      <DefaultPageLayout>
        <Container>
          <Grid container alignItems='center' justify='space-between'>
            <Grid item>
              <DefaultPageTitleFormat>Scoring Rubric</DefaultPageTitleFormat>
            </Grid>
            <Grid item>
              <IconButton onClick={() => push(`/setup/${id}`)}>
                <CancelIcon fontSize='large' />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container alignItems='center' justify='center'>
            {data && isOwner && (
              <ScoringConfigSelector
                isLoading={updateScoreLoading}
                onSubmit={handleUpdateScore}
                repository={data}
              />
            )}
          </Grid>
        </Container>
      </DefaultPageLayout>
    </div>
  );
};

export default ScoreRubricPage;
