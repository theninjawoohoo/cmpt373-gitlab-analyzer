import { ScoreOverride } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
import React from 'react';

interface ScoreOverrideFormProps {
  defaultValues?: ScoreOverride;
  open?: boolean;
  anchor?: PopperProps['anchorEl'];
  onClickAway?: () => void;
}

const ScoreOverrideForm: React.FC<ScoreOverrideFormProps> = ({
  anchor,
  open,
  onClickAway,
}) => {
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Popper anchorEl={anchor} open={open}>
        <Paper elevation={3}>
          <Box minWidth='15rem' p={2}>
            <form>
              <Grid container direction='column' spacing={1}>
                <Grid item>
                  <FormControlLabel
                    control={<Checkbox color='primary' />}
                    label='Exclude'
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label='Custom Score'
                    variant='outlined'
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label='Comment'
                    variant='outlined'
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item>
                  <Grid container justify='space-between'>
                    <Button variant='contained' color='secondary'>
                      Reset
                    </Button>
                    <Button variant='contained' color='primary'>
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Popper>
    </ClickAwayListener>
  );
};

export default ScoreOverrideForm;
