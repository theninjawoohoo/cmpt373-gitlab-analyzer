import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
// import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
// import { Button } from '@material-ui/core';
import LinkCard from '../RepositoryHomePage/components/LinkCard';

// const useStyles = makeStyles(() => ({
//   paper: {
//     padding: '15px',
//     textAlign: 'left',
//   },
// }));

const SettingsPage: React.FC = () => {
  // const styles = useStyles();
  return (
    <div>
      <DefaultPageLayout>
        <Container>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <DefaultPageTitleFormat>Settings</DefaultPageTitleFormat>
            </Grid>
            <Grid item xs={12}>
              <LinkCard color='#EFFFC0' icon='api' to={`/api`}>
                Change API Key
              </LinkCard>
            </Grid>
            <Grid item xs={12}>
              <LinkCard color='#FFECFB' icon='scoring' to={`/scoring`}>
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
