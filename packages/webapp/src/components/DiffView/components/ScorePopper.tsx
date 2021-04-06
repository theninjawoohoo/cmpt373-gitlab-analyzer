import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Diff } from '@ceres/types';
import ScoringChip from '../../ScoringChip';

interface ScorePopperProps {
  hasOverride?: boolean;
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
  hasOverride,
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
        <ScoringChip size='small' hasOverride={hasOverride}>
          {scoreCount || 0}
        </ScoringChip>
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
          <Typography display='inline'>
            {scoreSummary.add.toFixed(1) || 0}
          </Typography>
        </div>
        <div className={classes.summaryFlex}>
          <Typography display='inline'>comment: </Typography>
          <Typography display='inline'>
            {scoreSummary.comment.toFixed(1) || 0}
          </Typography>
        </div>
        <div className={classes.summaryFlex}>
          <Typography display='inline'>delete: </Typography>
          <Typography display='inline'>
            {scoreSummary.delete.toFixed(1) || 0}
          </Typography>
        </div>
        <div className={classes.summaryFlex}>
          <Typography display='inline'>syntax: </Typography>
          <Typography display='inline'>
            {scoreSummary.syntax.toFixed(1) || 0}
          </Typography>
        </div>
      </Popover>
    </div>
  );
};

export default ScorePopover;
