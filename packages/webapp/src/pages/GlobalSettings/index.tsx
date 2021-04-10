import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import LinkCard from '../../components/LinkCard';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <DefaultPageLayout>
        <Container>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <DefaultPageTitleFormat>Global Settings</DefaultPageTitleFormat>
            </Grid>
            <Grid item xs={12}>
              <LinkCard color='#ebdeff' icon='api' to='/settings/api'>
                Change API Key
              </LinkCard>
            </Grid>
            <Grid item xs={12}>
              <LinkCard color='#cdf7f0' icon='scoring' to='/settings/scoring'>
                Score Config
              </LinkCard>
            </Grid>
            <Grid item xs={12}>
              <LinkCard color='#B2F34D' icon='calendar' to='/settings/group'>
                Iteration Config
              </LinkCard>
            </Grid>
          </Grid>
        </Container>
      </DefaultPageLayout>
    </div>
  );
};

export default SettingsPage;
