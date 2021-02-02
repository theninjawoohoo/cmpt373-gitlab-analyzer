import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DefaultPageLayout from '../../components/DefaultPageLayout';

const useStyles = makeStyles((theme) => ({  }));

const Home: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div>
      <DefaultPageLayout/>
    </div>
  );
};

export default Home;
;
