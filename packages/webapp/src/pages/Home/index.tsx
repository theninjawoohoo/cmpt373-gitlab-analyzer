import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import HomeLogin from '../../components/HomeLogin';

const useStyles = makeStyles((theme) => ({
    root: {
      minHeight: '100vh',
      minWidth: '100vw',
      backgroundImage: `url(${process.env.PUBLIC_URL + '/landing-bg.jpg'})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    },
  }));

const Home: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <HomeLogin/>
    </div>
  );
};

export default Home;
;