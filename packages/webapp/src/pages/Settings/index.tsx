import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import LinkCard from '../RepositoryHomePage/components/LinkCard';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <DefaultPageLayout>
        <Container>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <DefaultPageTitleFormat>Settings</DefaultPageTitleFormat>
            </Grid>
            <Grid item xs={12}>
              <LinkCard color='#edd4ff' icon='api' to={`/api`}>
                Change API Key
              </LinkCard>
            </Grid>
            <Grid item xs={12}>
              <LinkCard color='#ccdfff' icon='scoring' to={`/scoring`}>
                Score Config
              </LinkCard>
            </Grid>
          </Grid>
        </Container>
      </DefaultPageLayout>
    </div>
  );
};

export default SettingsPage;
