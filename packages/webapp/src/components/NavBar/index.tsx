import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import UndecoratedLink from '../UndecoratedLink';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person'; 
import classes from '*.module.css';

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
                style={{width: '30vw'}}
                variant="persistent"
                anchor="left"
                open={true}
                classes={{paper: classes.drawerPaper}}
            >
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <PersonIcon></PersonIcon>
                        </ListItemIcon>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    </>
  );
};

export default NavBar;
