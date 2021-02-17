import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useVerifyToken } from '../../api/token';
import { useAuthContext } from '../../contexts/AuthContext';
import NavBar from '../NavBar';
import Form from './Form';
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
}));

const SettingsPageLayout: React.FC = () => {
  const styles = useStyles();
  const { user } = useAuthContext();
  const hasValidApi = useVerifyToken();
  const message = hasValidApi
    ? 'You have a valid API Key. To update your API Key, enter a new one below:'
    : 'You have an invalid API Key. Please enter a valid API Key below:';
  return (
    <>
      <div className={styles.gridDimensions}>
        {user?.sfuId ? (
          <>
            <NavBar username={user.sfuId} />
            <div className={styles.form}>
              <h2>{message}</h2>
              <Form />
            </div>
          </>
        ) : (
          <NavBar username={'Guest'} />
        )}
      </div>
    </>
  );
};

export default SettingsPageLayout;
