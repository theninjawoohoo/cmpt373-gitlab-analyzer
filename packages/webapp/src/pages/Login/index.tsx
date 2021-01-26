import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';

const Login: React.FC = () => {
  return (
    <DefaultPageLayout>
      <Container>
        <Box mt={6} textAlign='center'>
          <Typography variant='h1' align='center'>Login</Typography>
          <Box mt={4}>
            <Link href='https://cas.sfu.ca?service=http://localhost:3000/login/sfu'>
              <Button variant='contained' color='primary'>Login via SFU</Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </DefaultPageLayout>
  )
}

export default Login;