import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import NavBar from '../NavBar';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import { useScrollTrigger } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1,
    fontSize: '2rem',
  },

  gridDimensions: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
  },

  scroll: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
}));

interface ScrollTopProps {
  children: React.ReactElement;
}

function ScrollTop(props: ScrollTopProps) {
  const { children } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role='presentation' className={classes.scroll}>
        {children}
      </div>
    </Zoom>
  );
}

const DefaultPageLayout: React.FC = ({ children }, props: ScrollTopProps) => {
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
      <ScrollTop {...props}>
        <Fab color='secondary' size='large' aria-label='scroll back to top'>
          <KeyboardArrowUpIcon fontSize='large' />
        </Fab>
      </ScrollTop>
    </div>
  );
};

export default DefaultPageLayout;
