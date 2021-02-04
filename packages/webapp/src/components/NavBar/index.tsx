import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person'; 

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
       width: 'inherit',
    }
}));

export default function NavBar(props: any) {
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
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <PersonIcon></PersonIcon>
                        </ListItemIcon>
                        <ListItemText primary={"UserName"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={"API KEY: " + props.apiKey}/>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    </>
  );
};
