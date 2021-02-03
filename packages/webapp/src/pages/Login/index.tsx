import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HomeLogin from '../../components/HomeLogin';

const useStyles = makeStyles((theme) => ({
    root: {
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundImage: `url(${process.env.PUBLIC_URL + '/landing-bg.jpg'})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    },
  }));

const Login: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <HomeLogin/>
    </div>
  );
};

export default Login;
;
