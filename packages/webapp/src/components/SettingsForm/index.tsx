import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useVerifyToken } from '../../api/token';
import Form from './Form';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    fontSize: '2rem',
  },
  gridDimensions: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
  },
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
  const message = hasValidApi
    ? 'You have a valid API Key. To update your API Key, enter a new one below:'
    : 'You have an invalid API Key. Please enter a valid API Key below:';
  return (
    <Container>
      <DefaultPageTitleFormat>Settings</DefaultPageTitleFormat>
      <Box my={15}>
        <div className={styles.form}>
          <Typography variant='h5' color='primary'>
            {message}
          </Typography>
          <Form />
        </div>
      </Box>
    </Container>
  );
};

export default SettingsForm;
