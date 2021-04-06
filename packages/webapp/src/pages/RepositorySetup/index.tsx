import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import LinkCard from '../../components/LinkCard';
import { useParams } from 'react-router-dom';

const RepoSetupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <DefaultPageLayout>
        <Container>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <DefaultPageTitleFormat>Repository Setup</DefaultPageTitleFormat>
            </Grid>
            <Grid item xs={12}>
              <LinkCard
                color='#e4f5ba'
                icon='members'
                to={`/setup/${id}/members`}
              >
                Members
              </LinkCard>
            </Grid>
            <Grid item xs={12}>
              <LinkCard
                color='#ffd9cf'
                icon='rubric'
                to={`/setup/${id}/rubric`}
              >
                Score Rubric
              </LinkCard>
            </Grid>
          </Grid>
        </Container>
      </DefaultPageLayout>
    </div>
  );
};

export default RepoSetupPage;
