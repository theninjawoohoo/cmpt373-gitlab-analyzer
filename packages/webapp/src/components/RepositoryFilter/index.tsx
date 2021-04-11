import React from 'react';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { useFilterContext } from '../../contexts/FilterContext';
import Grid from '@material-ui/core/Grid';
import LuxonUtils from '@date-io/luxon';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import MemberDropdown from '../../components/MemberDropdown';
import { useGetIterations } from '../../api/groupConfig';
import { Box, Typography, Paper } from '@material-ui/core';
import { DateTime } from 'luxon';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const RepoFilter: React.FC = () => {
  const { repositoryId } = useRepositoryContext();
  const { data: iterationData } = useGetIterations({ repo_id: repositoryId });
  console.log(iterationData);
  const {
    startDate,
    endDate,
    iteration,
    setStartDate,
    setEndDate,
    setIteration,
  } = useFilterContext();

  const handleStartDateChange = (date: DateTime) => {
    setStartDate(date.startOf('second').toISO());
  };

  const handleEndDateChange = (date: DateTime) => {
    setEndDate(date.startOf('second').toISO());
  };

  const handleIterationChange = (iteration: string) => {
    setIteration(iteration);
  };

  return (
    <Paper>
      <Box p={2}>
        <Typography variant='h2'>Date Filter Config</Typography>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <KeyboardDateTimePicker
                variant='inline'
                format='MM/dd/yyyy hh:mm a'
                ampm={true}
                margin='normal'
                id='date-picker-inline'
                label='Start Date'
                value={startDate.toString()}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <KeyboardDateTimePicker
                variant='inline'
                format='MM/dd/yyyy hh:mm a'
                ampm={true}
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
            <Grid item xs={3}>
              <MemberDropdown repositoryId={repositoryId} />
            </Grid>
            <Grid item xs={3}>
              <FormControl variant='filled'>
                <InputLabel>Iteration:</InputLabel>
                <Select
                  style={{ minWidth: '14rem' }}
                  value={iteration}
                  onChange={(e) => {
                    e.preventDefault();
                    //Fix this.
                    handleIterationChange(iteration);
                    // handleStartDateChange();
                    // handleEndDateChange();
                  }}
                >
                  <MenuItem value='none'>No Iteration</MenuItem>
                  {(iterationData?.results || []).map((m) => (
                    <MenuItem key={m.meta.id} value={m.meta.id}>
                      {m.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Box>
    </Paper>
  );
};

export default RepoFilter;
