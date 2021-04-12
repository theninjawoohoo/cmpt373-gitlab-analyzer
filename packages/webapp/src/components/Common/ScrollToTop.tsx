import React from 'react';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { IconButton, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  scroll: {
    zIndex: 2,
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
    backgroundColor: '#DCDCDC',
    color: '#0A4D63',
    '&:hover, &.Mui-focusVisible': {
      transition: '0.3s',
      backgroundColor: '#0A4D63',
      color: 'white',
    },
  },
}));

const ScrollToTop = () => {
  const classes = useStyles();

  const handleClick = () => {
    window[`scrollTo`]({ top: 0, behavior: `smooth` });
  };

  return (
    <div>
      <IconButton onClick={handleClick} className={classes.scroll}>
        <KeyboardArrowUpIcon />
      </IconButton>
    </div>
  );
};

export default ScrollToTop;
