import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person'; 

const useStyles = makeStyles(() => ({
   drawerPaper: {width: 'inherit'}
}));

export const NavBar: React.FC = ({ children }) => {
  const styles = useStyles();
  const { state: authState, dispatch } = useAuthContext();
  return (
    <>
        <div>
            <Drawer
                style={{width: '25vw'}}
                variant="persistent"
                anchor="left"
                open={true}
                classes={{paper: styles.drawerPaper}}
            >
                <List mt={2}>
                    <ListItem>
                        <ListItemIcon>
                            <PersonIcon></PersonIcon>
                        </ListItemIcon>
                        <ListItemText primary={"UserName"}/>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    </>
  );
};

export default NavBar;
