import React from 'react';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { useFilterContext } from '../../contexts/FilterContext';
import Grid from '@material-ui/core/Grid';
import LuxonUtils from '@date-io/luxon';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import MemberDropdown from '../../components/MemberDropdown';

const RepoFilter: React.FC = () => {
  const { repositoryId } = useRepositoryContext();
  const { startDate, endDate, setStartDate, setEndDate } = useFilterContext();

  const [componentStartDate, setStartDateComponent] = React.useState(startDate);
  const [componentEndDate, setEndDateComponent] = React.useState(endDate);

  const handleStartDateChange = (date) => {
    setStartDate(date.startOf('day'));
    setStartDateComponent(date.toString());
  };

  const handleEndDateChange = (date) => {
    setEndDate(date.startOf('day'));
    setEndDateComponent(date.toString());
  };

  return (
    <Paper>
      <Box p={2}>
        <Typography variant='h2'>Date Filter Config</Typography>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <KeyboardDatePicker
                disableToolbar
                variant='inline'
                format='MM/dd/yyyy'
                margin='normal'
                id='date-picker-inline'
                label='Start Date'
                value={componentStartDate.toString()}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <KeyboardDatePicker
                disableToolbar
                variant='inline'
                format='MM/dd/yyyy'
                margin='normal'
                id='date-picker-inline'
                label='End Date'
                value={componentEndDate.toString()}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item alignItems='center'>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <MemberDropdown repositoryId={repositoryId} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Box>
    </Paper>
  );
};

export default RepoFilter;
