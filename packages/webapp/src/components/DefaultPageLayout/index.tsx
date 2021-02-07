import Box from '@material-ui/core/Box';
import { useState } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { useAuthContext } from '../../contexts/AuthContext';
import UndecoratedLink from '../UndecoratedLink';
import APIKeyModal from './APIKeyModal';
import Repository from './Repository';
import NavBar from '../NavBar';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    fontSize: '2rem',
  },
}));

const DefaultPageLayout: React.FC = ({ children }) => {
  const styles = useStyles();
  const { state: authState, dispatch } = useAuthContext();
  const [apiKey, setApiKey] = useState('');
  return (
    <>
      <Container>
        {authState?.user?.sfuId ? (
          <>
            <NavBar username={authState.user.sfuId}></NavBar>
          </>
        ) : (
          <NavBar username={'Guest'}></NavBar>
        )}
      </Container>
      <Box height='4rem' />
      {children}
      <APIKeyModal apiKey={apiKey} setApiKey={setApiKey} />
      <Repository />
    </>
  );
};

export default DefaultPageLayout;
