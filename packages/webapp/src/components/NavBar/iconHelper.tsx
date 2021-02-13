import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AppsIcon from '@material-ui/icons/Apps';
import ErrorIcon from '@material-ui/icons/Error';
import MergeType from '@material-ui/icons/MergeType';
import InsertChart from '@material-ui/icons/InsertChart';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

export default function Icon(props: any) {
  switch (props.icon) {
    case 'user':
      return <PersonIcon></PersonIcon>;
    case 'setting':
      return <SettingsIcon></SettingsIcon>;
    case 'logout':
      return <ExitToAppIcon></ExitToAppIcon>;
    case 'repo':
      return <AppsIcon></AppsIcon>;
    case 'collapse':
      return <ExitToAppIcon></ExitToAppIcon>;
    case 'graph':
      return <InsertChart></InsertChart>;
    case 'merge':
      return <MergeType></MergeType>;
    case 'commit':
      return <ArrowUpwardIcon></ArrowUpwardIcon>;
  }
  return <ErrorIcon></ErrorIcon>;
}
