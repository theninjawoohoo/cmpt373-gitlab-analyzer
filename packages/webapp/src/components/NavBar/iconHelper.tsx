import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AppsIcon from '@material-ui/icons/Apps';
import ErrorIcon from '@material-ui/icons/Error';
import MergeType from '@material-ui/icons/MergeType';
import InsertChart from '@material-ui/icons/InsertChart';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PeopleIcon from '@material-ui/icons/People';

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
    case 'collapse':
      return <ExitToAppIcon />;
    case 'graph':
      return <InsertChart />;
    case 'merge':
      return <MergeType />;
    case 'commit':
      return <ArrowUpwardIcon />;
    case 'operation':
      return <PlayArrowIcon />;
    case 'members':
      return <PeopleIcon />;
  }
  return <ErrorIcon />;
}
