import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import ItemBox from './itemBox';

interface UserNameProps {
  username: string;
}

const theme = createMuiTheme();

const useStyles = makeStyles(() => ({
  drawerPaper: {
    width: 'inherit',
    marginTop: theme.spacing(1),
  },
}));

const NavBar: React.FC<UserNameProps> = (UserNameProps) => {
  const styles = useStyles();
  const { state: authState, dispatch } = useAuthContext();
  return (
    <>
      <div>
        <Drawer
          style={{ width: '15vw' }}
          variant='persistent'
          anchor='left'
          open={true}
          classes={{ paper: styles.drawerPaper }}
        >
          <List>
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
