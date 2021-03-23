import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useVerifyToken } from '../../api/token';
import Form from './Form';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
}));

const SettingsForm: React.FC = () => {
  const styles = useStyles();
  const hasValidApi = useVerifyToken();
  const { push } = useHistory();
  const message = hasValidApi
    ? 'You have a valid API Key. To update your API Key, enter a new one below:'
    : 'You have an invalid API Key. Please enter a valid API Key below:';
  return (
    <Container>
      <Grid container alignItems='center' justify='space-between'>
        <Grid item>
          <DefaultPageTitleFormat>API Key</DefaultPageTitleFormat>
        </Grid>
        <Grid item>
          <IconButton onClick={() => push('/settings')}>
            <CancelIcon fontSize='large' />
          </IconButton>
        </Grid>
      </Grid>
      <Box my={15}>
        <div className={styles.form}>
          <Typography variant='h5'>{message}</Typography>
          <Form />
        </div>
      </Box>
    </Container>
  );
};

export default SettingsForm;
