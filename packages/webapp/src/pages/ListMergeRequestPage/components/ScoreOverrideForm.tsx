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
import { useForm } from 'react-hook-form';

interface ScoreOverrideFormProps {
  defaultValues?: Partial<ScoreOverride>;
  open?: boolean;
  anchor?: PopperProps['anchorEl'];
  onClickAway?: () => void;
  onSubmit?: (value: ScoreOverride) => void;
}

const ScoreOverrideForm: React.FC<ScoreOverrideFormProps> = ({
  anchor,
  open,
  onClickAway,
  onSubmit,
  defaultValues,
}) => {
  const { handleSubmit, register, reset } = useForm<ScoreOverride>({
    defaultValues,
  });
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Popper anchorEl={anchor} open={open}>
        <Paper elevation={3}>
          <Box minWidth='15rem' p={2}>
            <form
              autoComplete='off'
              spellCheck={false}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container direction='column' spacing={1}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color='primary'
                        inputRef={register}
                        defaultChecked={defaultValues?.exclude}
                      />
                    }
                    label='Exclude'
                    name='exclude'
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label='Custom Score'
                    variant='outlined'
                    inputRef={register}
                    name='score'
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label='Comment'
                    variant='outlined'
                    multiline
                    rows={4}
                    inputRef={register}
                    name='comment'
                  />
                </Grid>
                <Grid item>
                  <Grid container justify='space-between'>
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={() => reset({})}
                    >
                      Reset
                    </Button>
                    <Button variant='contained' color='primary' type='submit'>
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
