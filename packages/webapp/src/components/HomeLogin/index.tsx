import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useAuthContext } from '../../contexts/AuthContext';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
    root: {
      minHeight: '100vh',
    },
    
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
    },
  }));

const HomeLogin: React.FC = ({ children }) => {
  const classes = useStyles();
  const { state: authState, dispatch } = useAuthContext();
  return (
    <div>
    <Grid 
      container 
      direction="column" 
      justify="center" 
      alignItems="center" 
      spacing={2}
      className={classes.root}>
        <Grid item>
          <Typography className={classes.title}>
            GitLab Analyzer
          </Typography>
        </Grid>
        <Grid item>
          <Link href='https://cas.sfu.ca?service=http://localhost:3000/login/sfu'>
            <Button variant="contained" color="inherit">
              Log in via SFU
            </Button>
          </Link>
        </Grid>
    </Grid>
    </div>
  );
};

export default HomeLogin;
