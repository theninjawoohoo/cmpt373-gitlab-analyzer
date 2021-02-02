<<<<<<< HEAD
import React from "react";
import DefaultPageLayout from "../../components/HomePageLayout";

const Home: React.FC = () => <DefaultPageLayout />;

export default Home;
=======
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
>>>>>>> 3acd3cc4c1719d5034a389b2a363e43f4138a7d3
