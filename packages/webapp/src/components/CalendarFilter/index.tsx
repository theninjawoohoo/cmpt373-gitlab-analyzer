import React from 'react';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { useFilterContext } from '../../contexts/FilterContext';
import Grid from '@material-ui/core/Grid';
import LuxonUtils from '@date-io/luxon';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { useGetCommits } from '../../api/commit';

const CalendarFilter: React.FC = () => {
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
    setStartDate(date.startOf('second'));
    setStartDateContext(date.toUTC().toString());
    setArrayContext(commits?.results);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date.startOf('second'));
    setEndDateContext(date.toUTC().toString());
    setArrayContext(commits?.results);
  };

  return (
    <MuiPickersUtilsProvider utils={LuxonUtils}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <KeyboardDateTimePicker
            variant='inline'
            ampm={true}
            format='MM/dd/yyyy hh:mm a'
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
        <Grid item xs={6}>
          <KeyboardDateTimePicker
            variant='inline'
            ampm={true}
            format='MM/dd/yyyy hh:mm a'
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
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

export default CalendarFilter;
