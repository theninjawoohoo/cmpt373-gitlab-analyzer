import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Routes_I, Routes_II } from './routes';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Icon from './iconHelper';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: theme.transitions.create('width'),
      overflow: 'hidden',
    },
    menuButton: {
      marginRight: theme.spacing(0.1),
    },
    title: {
      flexGrow: 1,
    },
    drawer: {
      width: 300,
    },
    fullList: {
      width: 'auto',
    },
  }),
);

interface NavBarProps {
  username: string;
  repoId: string;
}

const NavigationBar: React.FC<NavBarProps> = (NavBarProps) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const repoId = useRepositoryContext();

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };

  const activeRoute = (routeName: any) => {
    const location = useLocation();
    return location.pathname === routeName;
  };

  return (
    <div>
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='menu'
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              GitLab Iteration Analyzer
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Drawer
        classes={{ paper: classes.drawer }}
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        <div
          className={classes.fullList}
          role='presentation'
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <MenuList>
            {/*User*/}
            <MenuItem>
              <ListItemIcon>
                <Icon icon='user' />
              </ListItemIcon>
              <ListItemText primary={NavBarProps.username} />
            </MenuItem>
            {/*  RepoRoute*/}
            <NavLink to='/repository' style={{ textDecoration: 'none' }}>
              <MenuItem selected={activeRoute('/repository')}>
                <ListItemIcon>
                  <Icon icon='repo' />
                </ListItemIcon>
                <ListItemText primary={'Repository'} />
              </MenuItem>
            </NavLink>
            <Divider />
            {/*Paths needing repoId*/}
            {Routes_I.map((prop, key) => {
              return (
                <NavLink
                  to={`${prop.path}/` + { repoId }}
                  style={{ textDecoration: 'none' }}
                  key={key}
                >
                  <MenuItem selected={activeRoute(prop.path + { repoId })}>
                    <ListItemIcon>
                      <Icon icon={prop.icon} />
                    </ListItemIcon>
                    <ListItemText primary={prop.sidebarName} />
                  </MenuItem>
                </NavLink>
              );
            })}
            <Divider />
            {/*Paths w/o repoId*/}
            {Routes_II.map((prop, key) => {
              return (
                <NavLink
                  to={prop.path}
                  style={{ textDecoration: 'none' }}
                  key={key}
                >
                  <MenuItem selected={activeRoute(prop.path)}>
                    <ListItemIcon>
                      <Icon icon={prop.icon} />
                    </ListItemIcon>
                    <ListItemText primary={prop.sidebarName} />
                  </MenuItem>
                </NavLink>
              );
            })}
          </MenuList>
        </div>
      </Drawer>
    </div>
  );
};

export default NavigationBar;
