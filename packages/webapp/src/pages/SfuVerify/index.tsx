import Container from '@material-ui/core/Container';
import React, { useEffect } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { parse } from 'querystring';
import { useLoginSfu } from '../../api/auth';
import { useAuthContext } from '../../contexts/AuthContext';

const SfuVerify: React.FC = () => {
  const location = useLocation();
  const query = parse(location.search.replace(/^\?/, ''));
  const { user, setToken } = useAuthContext();
  const { mutate: verify, data } = useLoginSfu();
  const ticket = query.ticket as string;
  useEffect(() => {
    if (ticket) {
      verify({ ticket });
    }
  }, [ticket]);

  useEffect(() => {
    if (data?.access_token) {
      setToken(data.access_token);
    }
  }, [data]);

  if (user) {
    return <Redirect to='/repository' />;
  }

  if (!ticket) {
    return <Container>No ticket found!</Container>;
  }

  return (
    <Container>
      <p>Your authentication ticket is being verified...</p>
    </Container>
  );
};

export default SfuVerify;
