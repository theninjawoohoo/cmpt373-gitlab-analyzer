import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useAuthContext } from '../../contexts/AuthContext';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
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

const HomeLogin: React.FC = ({ children }) => {
  const classes = useStyles();
  const { state: authState, dispatch } = useAuthContext();
  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
        <Grid item>
          <Typography className={classes.title}>
            GitLab Analyzer
          </Typography>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            color="secondary" 
            href='https://cas.sfu.ca?service=http://localhost:3000/sfu' 
            className={classes.loginButton}>
            Log in via SFU
          </Button>
        </Grid>
    </Grid>
  );
};

export default HomeLogin;
