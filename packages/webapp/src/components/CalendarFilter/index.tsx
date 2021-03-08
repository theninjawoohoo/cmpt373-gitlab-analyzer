import React from 'react';
//import 'date-fns';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { useDateFilterContext } from '../../contexts/DateFilterContext';
import Grid from '@material-ui/core/Grid';
import LuxonUtils from '@date-io/luxon';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useGetCommits } from '../../api/commit';
import { DateTime } from 'luxon';

interface DateProp {
  startDateIso?: string;
  endDateIso?: string;
}

const CalendarFilter: React.FC<DateProp> = (DateProp) => {
  const { repositoryId } = useRepositoryContext();
  const {
    setStartDateContext,
    setEndDateContext,
    setArrayContext,
  } = useDateFilterContext();
  const [startDate, setStartDate] = React.useState(
    DateTime.fromISO(DateProp.startDateIso),
  );
  console.log(startDate.toString());
  const [endDate, setEndDate] = React.useState(
    DateTime.fromISO(DateProp.endDateIso),
  );
  console.log(endDate.toString());

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
    console.log(commits?.results);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date.startOf('day'));
    setEndDateContext(date.toString());
    setArrayContext(commits?.results);
    console.log(commits?.results);
  };

  return (
    <MuiPickersUtilsProvider utils={LuxonUtils}>
      <Grid container justify='space-around'>
        <KeyboardDatePicker
          disableToolbar
          variant='inline'
          format='MM/dd/yyyy'
          margin='normal'
          id='date-picker-inline'
          label='Start Date'
          value={startDate.toString()}
          onChange={handleStartDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant='inline'
          format='MM/dd/yyyy'
          margin='normal'
          id='date-picker-inline'
          label='End Date'
          value={endDate.toString()}
          onChange={handleEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

export default CalendarFilter;
