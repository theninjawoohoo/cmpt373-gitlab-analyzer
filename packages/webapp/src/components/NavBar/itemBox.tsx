import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import Icon from './iconHelper';
import { NavLink, Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useRepositoryContext } from '../../contexts/RepositoryContext';

interface ListItemBoxProps {
  icon: string;
  primary: string;
  url: string;
  repositoryDependent?: boolean;
}

const useStyles = makeStyles(() => ({
  logoutButton: {
    bottom: '1rem',
    position: 'absolute',
  },
}));

const ItemBox: React.FC<ListItemBoxProps> = (ListItemBoxProps) => {
  const styles = useStyles();
  const { logout } = useAuthContext();
  const { repositoryId } = useRepositoryContext();
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
    return (
      <ListItem button>
        <ListItemIcon>
          <Icon icon={ListItemBoxProps.icon} />
        </ListItemIcon>
        <ListItemText primary={ListItemBoxProps.primary} />
      </ListItem>
    );
  } else if (ListItemBoxProps.icon == 'logout') {
    return (
      <ListItem
        button
        component={Link}
        to={ListItemBoxProps.url}
        onClick={logout}
      >
        <ListItemIcon>
          <Icon icon={ListItemBoxProps.icon} />
        </ListItemIcon>
        <ListItemText primary={ListItemBoxProps.primary} />
      </ListItem>
    );
  } else if (ListItemBoxProps.repositoryDependent && repositoryId == '') {
    return (
      <ListItem button disabled component={Link} to={ListItemBoxProps.url}>
        <ListItemIcon>
          <Icon icon={ListItemBoxProps.icon} />
        </ListItemIcon>
        <ListItemText primary={ListItemBoxProps.primary} />
      </ListItem>
    );
  }
  return (
    <ListItem
      button
      component={NavLink}
      exact
      to={ListItemBoxProps.url}
      activeStyle={{ color: 'red' }}
    >
      <ListItemIcon>
        <Icon icon={ListItemBoxProps.icon} />
      </ListItemIcon>
      <ListItemText primary={ListItemBoxProps.primary} />
    </ListItem>
  );
};

export default ItemBox;
