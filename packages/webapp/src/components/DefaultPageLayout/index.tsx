import Box from '@material-ui/core/Box';
import { useState } from 'react';
import Grid from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import APIKeyModal from './APIKeyModal';
import Repository from './Repository';
import NavBar from '../NavBar';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    fontSize: '2rem',
  },

  gridDimensions: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
  },
}));

const DefaultPageLayout: React.FC = ({ children }) => {
  const styles = useStyles();
  const { state: authState, dispatch } = useAuthContext();
  const [apiKey, setApiKey] = useState('');
  return (
    <div className={styles.gridDimensions}>
      {authState?.user?.sfuId ? (
        <>
          <NavBar username={authState.user.sfuId}></NavBar>
        </>
      ) : (
        <NavBar username={'Guest'}></NavBar>
      )}
      {children}
      <Repository />
      <APIKeyModal apiKey={apiKey} setApiKey={setApiKey} />
    </div>
  );
};

export default DefaultPageLayout;
