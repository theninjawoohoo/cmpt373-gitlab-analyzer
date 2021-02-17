import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import Icon from './iconHelper';
import { Link } from 'react-router-dom';

interface ListItemBoxProps {
  icon: string;
  primary: string;
  url: string;
}

const useStyles = makeStyles(() => ({
  logoutButton: {
    bottom: '1rem',
    position: 'absolute',
  },
}));

const ItemBox: React.FC<ListItemBoxProps> = (ListItemBoxProps) => {
  const styles = useStyles();
  if (ListItemBoxProps.primary == 'Logout') {
    return (
      <ListItem
        button
        component={Link}
        to={ListItemBoxProps.url}
        className={styles.logoutButton}
      >
        <ListItemIcon>
          <Icon icon={ListItemBoxProps.icon} />
        </ListItemIcon>
        <ListItemText primary={ListItemBoxProps.primary} />
      </ListItem>
    );
  } else if (ListItemBoxProps.primary == 'Collapse') {
    return (
      <>
        <ListItemIcon>
          <Icon icon={ListItemBoxProps.icon} />
        </ListItemIcon>
        <ListItemText primary={ListItemBoxProps.primary} />
      </>
    );
  } else if (ListItemBoxProps.icon == 'user') {
    <ListItem button>
      <ListItemIcon>
        <Icon icon={ListItemBoxProps.icon} />
      </ListItemIcon>
      <ListItemText primary={ListItemBoxProps.primary} />
    </ListItem>;
  }

  return (
    <ListItem button component={Link} to={ListItemBoxProps.url}>
      <ListItemIcon>
        <Icon icon={ListItemBoxProps.icon} />
      </ListItemIcon>
      <ListItemText primary={ListItemBoxProps.primary} />
    </ListItem>
  );
};

export default ItemBox;
