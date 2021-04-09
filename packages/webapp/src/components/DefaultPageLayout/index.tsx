import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
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
    </div>
  );
};

export default DefaultPageLayout;
