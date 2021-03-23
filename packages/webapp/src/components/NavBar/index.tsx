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
    width: '6rem',
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
      <div style={{ width: '6rem' }} className={styles.root}>
        <List className={styles.listCSS}>
          <ItemBox icon='user' primary={UserNameProps.username} />
          <ItemBox
            icon='repo'
            primary={'Repository'}
            url={repositoryId ? `/repository/${repositoryId}` : '/repository'}
          />
          <ItemBox
            icon='merge'
            primary={'Merge Requests'}
            url={`/merge/${repositoryId}`}
            repositoryDependent
          />
          <ItemBox
            icon='commit'
            primary={'Commits'}
            url={`/commits?repository=${repositoryId}`}
            repositoryDependent
          />
          <ItemBox
            icon='graph'
            primary={'Graphs'}
            url={`/graph/${repositoryId}`}
            repositoryDependent
          />
          <ItemBox
            icon='members'
            primary={'Members'}
            url={`/repository/${repositoryId}/members`}
            repositoryDependent
          />
          <ItemBox icon='setting' primary={'Settings'} url='/settings' />
          <ItemBox icon='operation' primary={'Operations'} url='/operations' />
          <ItemBox icon='logout' primary={'Logout'} url='/logout' />
        </List>
      </div>
    </>
  );
};

export default NavBar;
