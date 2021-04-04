import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import LinkCard from '../../components/LinkCard';

const RepoSetupPage: React.FC = () => {
  return (
    <div>
      <DefaultPageLayout>
        <Container>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <DefaultPageTitleFormat>Repository Config</DefaultPageTitleFormat>
            </Grid>
            <Grid item xs={12}>
              <LinkCard color='#FFEDC0' icon='members' to='/settings/api'>
                Members
              </LinkCard>
            </Grid>
            <Grid item xs={12}>
              <LinkCard color='#d7ffd1' icon='rubric' to='/settings/scoring'>
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
