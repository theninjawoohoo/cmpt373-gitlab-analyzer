import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
    height: '100%',
  },
}));

const NavBar: React.FC<UserNameProps> = (UserNameProps) => {
  const theme = useTheme();
  const styles = useStyles(theme);
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
            <ItemBox icon='user' primary={UserNameProps.username} url='/' />
            <ItemBox icon='repo' primary={'Repository'} url='/home' />
            <ItemBox icon='setting' primary={'Settings'} url='/settings' />
            <ItemBox icon='logout' primary={'Logout'} url='/logout' />
          </List>
        </Drawer>
      </div>
    </>
  );
};

export default NavBar;
