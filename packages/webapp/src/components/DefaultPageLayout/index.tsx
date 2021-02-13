import { useState } from 'react';
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
  const { user } = useAuthContext();
  const styles = useStyles();
  const [apiKey, setApiKey] = useState('');
  return (
    <div className={styles.gridDimensions}>
      {user?.sfuId ? (
        <>
          <NavBar username={user.sfuId} />
        </>
      ) : (
        <NavBar username={'Guest'} />
      )}
      {children}
      <Repository />
      <APIKeyModal apiKey={apiKey} setApiKey={setApiKey} />
    </div>
  );
};

export default DefaultPageLayout;
