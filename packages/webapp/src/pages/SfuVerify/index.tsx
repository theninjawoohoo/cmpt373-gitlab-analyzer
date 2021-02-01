import Container from '@material-ui/core/Container';
import React, { useEffect, useState } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { parse } from 'querystring';
import { loginSfu } from '../../api/auth';
import { getProfile } from '../../api/user';
import { useAuthContext } from '../../contexts/AuthContext';
import axios from '../../util/axios';

const SfuVerify: React.FC = () => {
  const [verified, setVerified] = useState(false);
  const location = useLocation();
  const query = parse(location.search.replace(/^\?/, ''));
  const { dispatch } = useAuthContext();
  const ticket = query.ticket;

  useEffect(() => {
    const verifyTicket = async () => {
      try {
        const response = await loginSfu(ticket as string);
        if (response.access_token) {
          dispatch({ type: 'SAVE_TOKEN', token: response.access_token });
          axios.defaults.headers['Authorization'] = `Bearer ${response.access_token}`;
          const profile = await getProfile();
          dispatch({ type: 'SET_USER', user: profile });
          setVerified(true);
        }
      } catch (e) {
        // TODO: show an error message
      }
    }
    if (ticket) {
      void verifyTicket()
    }
  }, [ticket, dispatch])

  if (verified) {
    return <Redirect to='/home' />
  }

  if (!ticket) {
    return <Container>No ticket found!</Container>
  }

  return (
    <Container>
      <p>Your authentication ticket is being verified...</p>
    </Container>
  )
}

export default SfuVerify;