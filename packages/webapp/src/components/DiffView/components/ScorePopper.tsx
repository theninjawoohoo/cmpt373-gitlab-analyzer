import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Diff } from '@ceres/types';
import { Chip } from '@material-ui/core';

interface ScorePopperProps {
  scoreCount: string;
  scoreSummary?: Diff['summary'];
}
const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  summaryFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const ScorePopover: React.FC<ScorePopperProps> = ({
  scoreCount,
  scoreSummary,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: { currentTarget: any }) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup='true'
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <Chip size='small' label={scoreCount || 0} />
      </Typography>
      <Popover
        id='mouse-over-popover'
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        PaperProps={{
          style: { minWidth: '150px' },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className={classes.summaryFlex}>
          <Typography display='inline'>add: </Typography>
          <Typography display='inline'>{scoreSummary.add}</Typography>
        </div>
        <div className={classes.summaryFlex}>
          <Typography display='inline'>comment: </Typography>
          <Typography display='inline'>{scoreSummary.comment}</Typography>
        </div>
        <div className={classes.summaryFlex}>
          <Typography display='inline'>delete: </Typography>
          <Typography display='inline'>{scoreSummary.delete}</Typography>
        </div>
        <div className={classes.summaryFlex}>
          <Typography display='inline'>gap: </Typography>
          <Typography display='inline'>{scoreSummary.gap}</Typography>
        </div>
        <div className={classes.summaryFlex}>
          <Typography display='inline'>syntax: </Typography>
          <Typography display='inline'>{scoreSummary.syntax}</Typography>
        </div>
        <div className={classes.summaryFlex}>
          <Typography display='inline'>no change: </Typography>
          <Typography display='inline'>{scoreSummary['no-change']}</Typography>
        </div>
      </Popover>
    </div>
  );
};

export default ScorePopover;
