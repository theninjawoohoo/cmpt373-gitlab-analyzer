import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useGetRepository } from '../../api/repository';
import ScoringConfigSelector from '../RepositoryHomePage/components/ScoringConfigSelector';
import { ApiResource } from '../../api/base';
import { useUpdateScoring } from '../../api/scoring';
import { ScoringConfig } from '@ceres/types';

const ScoreRubricPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const { data, invalidate } = useGetRepository(id);
  const isOwner = user?.id === data?.extensions?.owner?.id;
  const {
    mutate: updateScoring,
    isLoading: updateScoreLoading,
  } = useUpdateScoring();

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
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <DefaultPageTitleFormat>Score Rubric</DefaultPageTitleFormat>
            </Grid>
            <Grid item xs={12}>
              {data && isOwner && (
                <ScoringConfigSelector
                  isLoading={updateScoreLoading}
                  onSubmit={handleUpdateScore}
                  repository={data}
                />
              )}
            </Grid>
          </Grid>
        </Container>
      </DefaultPageLayout>
    </div>
  );
};

export default ScoreRubricPage;
