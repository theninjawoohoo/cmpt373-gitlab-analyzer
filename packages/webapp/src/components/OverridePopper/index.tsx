import React, { useState } from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import { ScoreOverride } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

interface OverridePopperProps {
  override: ScoreOverride;
}

const OverridePopper: React.FC<OverridePopperProps> = ({ override }) => {
  const [anchor, setAnchor] = useState(null);

  const handleMouseEnter = (event: { currentTarget: any }) => {
    setAnchor(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchor(null);
  };

  const open = !!anchor;

  return (
    <>
      <Typography
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <WarningIcon />
      </Typography>
      <Popper anchorEl={anchor} open={open}>
        <Paper>
          <Box p={2} minWidth='8rem'>
            <Grid container>
              <Grid item>
                <Typography>Last changed by {override.user.display}</Typography>
                <Typography>
                  Custom score: {override.score || 'No custom score'}
                </Typography>
                <Typography>
                  Comment: {override.comment || 'No comment provided'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Popper>
    </>
  );
};

export default OverridePopper;
