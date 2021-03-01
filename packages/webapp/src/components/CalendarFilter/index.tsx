import React from 'react';
import 'date-fns';
//import { useRepositoryContext } from '../../contexts/RepositoryContext';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
//import { useDateFilterCommits } from '../../api/commit';

const CalendarFilter: React.FC = () => {
  //const { repositoryId } = useRepositoryContext();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // const DateCommitSearchQuery = {
    //   repository: repositoryId,
    //   start_date: startDate.toString(),
    //   end_date: endDate.toString(),
    // };
    // const { data: commits } = useDateFilterCommits(DateCommitSearchQuery);
    // console.log(commits);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    // const DateCommitSearchQuery = {
    //   repository: repositoryId,
    //   start_date: startDate.toString(),
    //   end_date: endDate.toString(),
    // };
    // const { data: commits } = useDateFilterCommits(DateCommitSearchQuery);
    // console.log(commits);
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
