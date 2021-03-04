import React from 'react';
import 'date-fns';
//import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { useDateFilterContext } from '../../contexts/DateFilterContext';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useGetCommits } from '../../api/commit';
import { useParams } from 'react-router-dom';

interface DateProp {
  startDateIso?: string;
  endDateIso?: string;
}

const CalendarFilter: React.FC<DateProp> = (DateProp) => {
  const { id } = useParams<{ id: string }>();
  const {
    setStartDateContext,
    setEndDateContext,
    setArrayContext,
  } = useDateFilterContext();
  const [startDate, setStartDate] = React.useState(
    new Date(DateProp.startDateIso),
  );
  const [endDate, setEndDate] = React.useState(new Date(DateProp.endDateIso));
  const { data: commits } = useGetCommits(
    {
      repository: id,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    },
    0,
    9000,
  );

  const handleStartDateChange = (date) => {
    date.setHours(0, 0, 0, 0);
    setStartDate(date);
    setStartDateContext(date.toISOString());
    console.log(commits.results);
    setArrayContext(commits.results);
  };

  const handleEndDateChange = (date) => {
    date.setHours(0, 0, 0, 0);
    setEndDate(date);
    setEndDateContext(date.toISOString());
    setArrayContext(commits.results);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify='space-around'>
        <KeyboardDatePicker
          disableToolbar
          variant='inline'
          format='MM/dd/yyyy'
          margin='normal'
          id='date-picker-inline'
          label='Start Date'
          value={startDate}
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
          value={endDate}
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
