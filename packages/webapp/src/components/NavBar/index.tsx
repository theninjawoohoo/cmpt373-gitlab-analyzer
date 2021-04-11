import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import ItemBox from './itemBox';
import { useRepositoryContext } from '../../contexts/RepositoryContext';

interface UserNameProps {
  username: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    transition: theme.transitions.create('width'),
    overflow: 'hidden',
    minHeight: '100vh',
  },

  listCSS: {
    width: '6.5rem',
    position: 'fixed',
    height: '100%',
    backgroundColor: '#0A4D63',
  },
}));

const NavBar: React.FC<UserNameProps> = (UserNameProps) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { repositoryId } = useRepositoryContext();

  return (
    <>
      <div style={{ width: '6.5rem' }} className={styles.root}>
        <List className={styles.listCSS}>
          <ItemBox icon='user' primary={UserNameProps.username} />
          <ItemBox icon='repo' primary={'Repositories'} url={'/repository'} />
          <ItemBox
            icon='setup'
            primary={'Repository Setup'}
            url={`/setup/${repositoryId}`}
            repositoryDependent
          />
          <ItemBox
            icon='merge'
            primary={'Code'}
            url={`/merge/${repositoryId}`}
            repositoryDependent
          />
          <ItemBox
            icon='graph'
            primary={'Graphs'}
            url={`/graph/${repositoryId}`}
            repositoryDependent
          />
          <ItemBox
            icon='comment'
            primary={'Comment'}
            url={`/comment/${repositoryId}`}
            repositoryDependent
          />
          <ItemBox icon='setting' primary={'Global Settings'} url='/settings' />
          <ItemBox icon='operation' primary={'Operations'} url='/operations' />
          <ItemBox icon='logout' primary={'Logout'} url='/logout' />
        </List>
      </div>
    </>
  );
};

export default NavBar;
