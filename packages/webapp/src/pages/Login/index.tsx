<<<<<<< HEAD
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import React from "react";
import HomePageLayout from "../../components/HomePageLayout";
=======
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HomeLogin from '../../components/HomeLogin';
>>>>>>> 3acd3cc4c1719d5034a389b2a363e43f4138a7d3

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
<<<<<<< HEAD
    <HomePageLayout>
      <Container>
        <Box mt={6} textAlign="center">
          <Typography variant="h1" align="center">
            Login
          </Typography>
          <Box mt={4}>
            <Link href="https://cas.sfu.ca?service=http://localhost:3000/login/sfu">
              <Button variant="contained" color="primary">
                Login via SFU
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </HomePageLayout>
=======
    <div className={classes.root}>
      <HomeLogin/>
    </div>
>>>>>>> 3acd3cc4c1719d5034a389b2a363e43f4138a7d3
  );
};

export default Login;
<<<<<<< HEAD
=======
;
>>>>>>> 3acd3cc4c1719d5034a389b2a363e43f4138a7d3
