import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import Icon from './iconHelper';

interface ListItemBoxProps {
  icon: string;
  primary: string;
  url: string;
}

const useStyles = makeStyles(() => ({
  logoutButton: {
    top: '725px',
  },
}));

const ItemBox: React.FC<ListItemBoxProps> = (ListItemBoxProps) => {
  const styles = useStyles();
  if (ListItemBoxProps.primary == 'Logout') {
    return (
      <ListItem
        button
        component='a'
        href={ListItemBoxProps.url}
        className={styles.logoutButton}
      >
        <ListItemIcon>
          <Icon icon={ListItemBoxProps.icon}></Icon>
        </ListItemIcon>
        <ListItemText primary={ListItemBoxProps.primary} />
      </ListItem>
    );
  }

  return (
    <ListItem button component='a' href={ListItemBoxProps.url}>
      <ListItemIcon>
        <Icon icon={ListItemBoxProps.icon}></Icon>
      </ListItemIcon>
      <ListItemText primary={ListItemBoxProps.primary} />
    </ListItem>
  );
};

export default ItemBox;
