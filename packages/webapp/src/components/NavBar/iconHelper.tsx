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
import BuildIcon from '@material-ui/icons/Build';
import ScoreIcon from '@material-ui/icons/Score';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import TuneIcon from '@material-ui/icons/Tune';
import ListAltIcon from '@material-ui/icons/ListAlt';
import CommentIcon from '@material-ui/icons/Comment';

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
      return <InsertChart fontSize={props.size} />;
    case 'merge':
      return <MergeType fontSize={props.size} />;
    case 'commit':
      return <ArrowUpwardIcon fontSize={props.size} />;
    case 'operation':
      return <PlayArrowIcon />;
    case 'members':
      return <PeopleIcon fontSize={props.size} />;
    case 'api':
      return <BuildIcon fontSize={props.size} />;
    case 'scoring':
      return <ScoreIcon fontSize={props.size} />;
    case 'setup':
      return <TuneIcon fontSize={props.size} />;
    case 'rubric':
      return <ListAltIcon fontSize={props.size} />;
    case 'comment':
      return <CommentIcon />;
    case 'calendar':
      return <CalendarTodayIcon />;
  }
  return <ErrorIcon />;
}
