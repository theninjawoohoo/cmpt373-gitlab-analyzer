import React from 'react';
import { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ListItem, List } from '@material-ui/core';
import ItemBox from './itemBox';

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
    width: '14rem',
    position: 'relative',
    height: '100%',
  },
}));

const NavBar: React.FC<UserNameProps> = (UserNameProps) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        style={open ? { width: '14rem' } : { width: '4rem' }}
        className={styles.root}
      >
        <List className={styles.listCSS}>
          <ListItem button onClick={() => setOpen(!open)}>
            <ItemBox icon='collapse' primary={'Collapse'} url='nil' />
          </ListItem>
          <ItemBox
            icon='user'
            primary={UserNameProps.username}
            url='/repository'
          />
          <ItemBox icon='repo' primary={'Repository'} url='/repository' />
          <ItemBox icon='graph' primary={'Graph'} url='/graph' />
          <ItemBox icon='merge' primary={'Merge Reqests'} url='/merge' />
          <ItemBox icon='commit' primary={'Commits'} url='/commits' />
          <ItemBox icon='setting' primary={'Settings'} url='/settings' />
          <ItemBox icon='logout' primary={'Logout'} url='/' />
        </List>
      </div>
    </>
  );
};

export default NavBar;
