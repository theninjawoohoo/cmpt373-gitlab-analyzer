import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AppsIcon from '@material-ui/icons/Apps';
import ErrorIcon from '@material-ui/icons/Error';

export default function Icon(props: any) {
  switch (props.icon) {
    case 'user':
      return <PersonIcon />;
    case 'setting':
      return <SettingsIcon />;
    case 'logout':
      return <ExitToAppIcon />;
    case 'repo':
      return <AppsIcon />;
  }
  return <ErrorIcon />;
}
