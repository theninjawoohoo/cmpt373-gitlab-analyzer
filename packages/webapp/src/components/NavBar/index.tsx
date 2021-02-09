import React, { useState } from 'react';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { useAuthContext } from '../../contexts/AuthContext';
import { Drawer, List, IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ItemBox from './itemBox';

interface UserNameProps {
  username: string;
}

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: 'inherit',
    marginTop: theme.spacing(1),
  },
  listCSS: {
    position: 'relative',
  },
}));

const NavBar: React.FC<UserNameProps> = (UserNameProps) => {
  const theme = createMuiTheme();
  const styles = useStyles(theme);
  const { state: authState, dispatch } = useAuthContext();
  return (
    <>
      <div>
        <Drawer
          style={{ width: '14rem' }}
          variant='persistent'
          anchor='left'
          open={true}
          classes={{ paper: styles.drawerPaper }}
        >
          <List className={styles.listCSS}>
            <IconButton edge='end'>
              <ExitToAppIcon />
            </IconButton>
            <ItemBox
              icon='user'
              primary={UserNameProps.username}
              url='/'
            ></ItemBox>
            <ItemBox icon='repo' primary={'Repository'} url='/home'></ItemBox>
            <ItemBox
              icon='setting'
              primary={'Settings'}
              url='/settings'
            ></ItemBox>
            <ItemBox icon='logout' primary={'Logout'} url='/logout'></ItemBox>
          </List>
        </Drawer>
      </div>
    </>
  );
};

export default NavBar;
