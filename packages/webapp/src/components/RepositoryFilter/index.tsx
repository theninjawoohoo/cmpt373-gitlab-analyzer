import React from 'react';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { useFilterContext } from '../../contexts/FilterContext';
import Grid from '@material-ui/core/Grid';
import LuxonUtils from '@date-io/luxon';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useGetCommits } from '../../api/commit';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import MemberDropdown from '../../components/MemberDropdown';

const RepoFilter: React.FC = () => {
  const { repositoryId } = useRepositoryContext();
  const {
    startDate,
    endDate,
    setStartDateContext,
    setEndDateContext,
    setArrayContext,
  } = useFilterContext();

  const [componentStartDate, setStartDate] = React.useState(startDate);
  const [componentEndDate, setEndDate] = React.useState(endDate);

  const { data: commits } = useGetCommits(
    {
      repository: repositoryId,
      start_date: startDate.toString(),
      end_date: endDate.toString(),
    },
    0,
    9000,
  );

  const handleStartDateChange = (date) => {
    setStartDate(date.startOf('day'));
    setStartDateContext(date.toString());
    setArrayContext(commits?.results);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date.startOf('day'));
    setEndDateContext(date.toString());
    setArrayContext(commits?.results);
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
            <Grid item>
              <Grid container alignItems='flex-end' spacing={1}>
                <Grid item xs={4}>
                  <Box mb={1}>
                    <MemberDropdown repositoryId={repositoryId} />
                  </Box>
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
