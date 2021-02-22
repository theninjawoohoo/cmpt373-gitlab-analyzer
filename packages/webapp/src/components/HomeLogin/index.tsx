import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },

  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },

  loginButton: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
}));

const REDIRECT_URL =
  process.env.REACT_APP_SFU_REDIRECT || 'http://localhost:3000/sfu';

const HomeLogin: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid container direction='column' spacing={2} className={classes.root}>
      <Grid item>
        <Typography className={classes.title}>GitLab Analyzer</Typography>
      </Grid>
      <Grid item>
        <Button
          variant='outlined'
          color='secondary'
          href={`https://cas.sfu.ca?service=${REDIRECT_URL}`}
          className={classes.loginButton}
        >
          Log in via SFU
        </Button>
      </Grid>
    </Grid>
  );
};

export default HomeLogin;
