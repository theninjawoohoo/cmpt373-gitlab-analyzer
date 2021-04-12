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
import { DateTime } from 'luxon';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useSearchGroupConfigs } from '../../api/groupConfig';
import { flatten } from 'lodash';

const RepoFilter: React.FC = () => {
  const { repositoryId } = useRepositoryContext();
  const { data: groupConfigs } = useSearchGroupConfigs({
    repo_id: repositoryId,
  });
  const iterations = flatten(
    (groupConfigs?.results || []).map((gc) => {
      return (gc.iteration || []).map((i) => ({
        id: `${gc.name}/${i.name}`,
        display: `${i.name} (${gc.name})`,
        start: i.start,
        end: i.end,
      }));
    }),
  );
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
    setIteration('none');
  };

  const handleEndDateChange = (date: DateTime) => {
    setEndDate(date.startOf('second').toISO());
    setIteration('none');
  };

  const handleIterationChange = (iterationId: string) => {
    setIteration(iterationId);
    if (iterationId !== 'none') {
      const iteration = iterations.find((i) => i.id === iterationId);
      if (iteration) {
        setStartDate(iteration.start);
        setEndDate(iteration.end);
      }
    }
  };

  return (
    <Box p={2}>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <KeyboardDateTimePicker
              variant='inline'
              inputVariant='filled'
              format='MM/dd/yyyy hh:mm a'
              ampm={true}
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
              inputVariant='filled'
              format='MM/dd/yyyy hh:mm a'
              ampm={true}
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
            <FormControl variant='filled' fullWidth>
              <InputLabel>Iteration:</InputLabel>
              <Select
                value={iteration}
                onChange={(e) => {
                  e.preventDefault();
                  handleIterationChange(e.target.value as string);
                }}
              >
                <MenuItem value='none'>No Iteration</MenuItem>
                {iterations.map((i) => (
                  <MenuItem key={i.id} value={i.id}>
                    {i.display}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    </Box>
  );
};

export default RepoFilter;
