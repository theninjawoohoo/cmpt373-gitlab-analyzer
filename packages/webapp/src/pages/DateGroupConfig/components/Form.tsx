import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import LuxonUtils from '@date-io/luxon';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useRepository } from '../../../api/repository';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { GroupConfig, Iteration, LinkedRepositories } from '@ceres/types';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { DateTime } from 'luxon';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

const validationSchema = yup.object().shape({
  name: yup.string().required('A group config requires a name'),
  iteration: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        name: yup.string().required('Iteration Name is required'),
        start: yup.string().typeError('Something is wrong with Date field'),
      }),
    ),
});

interface FormProps {
  onSubmit: (values: GroupConfig) => void;
  defaultValues?: Partial<GroupConfig>;
}

const Form: React.FC<FormProps> = ({ defaultValues, onSubmit }) => {
  const {
    control,
    handleSubmit,
    watch,
    register,
    setValue,
    errors,
  } = useForm<GroupConfig>({
    defaultValues: {
      name: defaultValues?.name || '',
      iteration: defaultValues?.iteration || [{}],
      repositories: defaultValues?.repositories || [{}],
    },
    resolver: yupResolver(validationSchema),
  });

  const { data: data } = useRepository({
    name: '',
  });

  const blankLinkedRepo = { id: 'N/A', display: '' };
  const [repoState, setRepoState] = useState(blankLinkedRepo);
  const [startDate, setStartDate] = useState<MaterialUiPickersDate>(null);
  const [endDate, setEndDate] = useState<MaterialUiPickersDate>(null);

  const startVal = watch('iteration.start') as DateTime;
  const endVal = watch('iteration.end') as DateTime;

  useEffect(() => {
    register('iteration.start');
    register('iteration.end');
  }, [register]);

  useEffect(() => {
    setStartDate(startVal || null);
    setEndDate(endVal || null);
  }, [setStartDate, setEndDate, startVal, endVal]);

  const handleRepoChange = (e) => {
    const display = e.target.value as string;
    const id = data.results.find((repo) => repo.name == display).id;
    setRepoState((prevState) => ({
      ...prevState,
      [display]: id,
    }));
  };

  const {
    fields: repoFields,
    append: repoAppend,
    remove: repoRemove,
    swap: repoSwap,
    insert: repoInsert,
  } = useFieldArray<LinkedRepositories>({
    control,
    name: 'repository',
  });

  const {
    fields: iterFields,
    append: iterAppend,
    remove: iterRemove,
    swap: iterSwap,
    insert: iterInsert,
  } = useFieldArray<Iteration>({
    control,
    name: 'iteration',
  });

  return (
    <Box marginY={2}>
      <form
        autoComplete='off'
        spellCheck={false}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box my={2}>
          <TextField
            fullWidth
            name='name'
            label='Name'
            inputRef={register}
            variant='outlined'
            error={!!errors?.name}
            helperText={errors?.name?.message}
          />
        </Box>

        <Typography variant='h2'>Repository Selection</Typography>
        {repoFields.map((field, index) => (
          <div key={field.id}>
            <Box my={1} p={1}>
              <Grid container spacing={1}>
                <Grid item xs={7}>
                  <TextField
                    label='Repository'
                    name={`repositories[${index}].display`}
                    variant='outlined'
                    inputRef={register()}
                    select
                    onChange={handleRepoChange}
                    defaultValue={field?.display}
                    fullWidth
                  >
                    <InputLabel>Repo List:</InputLabel>
                    <MenuItem value='none'>None</MenuItem>
                    {(data.results || [])?.map((m) => (
                      <MenuItem key={m.id} value={m.name}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label='ID'
                    name={`repositories[${index}].id`}
                    variant='outlined'
                    inputRef={register()}
                    value={repoState[field?.display]}
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={3}>
                  <Grid justify='flex-end' alignItems='center' container>
                    {index !== 0 && (
                      <IconButton onClick={() => repoSwap(index - 1, index)}>
                        <ArrowUpwardIcon />
                      </IconButton>
                    )}
                    {index !== repoFields.length - 1 && (
                      <IconButton onClick={() => repoSwap(index, index + 1)}>
                        <ArrowDownwardIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => repoRemove(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            {index !== repoFields.length - 1 && (
              <Box position='relative' py={2}>
                <Divider variant='middle' />
                <Box position='absolute' top={-5} left='50%'>
                  <IconButton onClick={() => repoInsert(index + 1, {})}>
                    <AddCircleIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </div>
        ))}
        <Grid container justify='center' alignItems='center'>
          <Box mr={2}>
            <Button
              type='button'
              variant='contained'
              color='secondary'
              onClick={() => {
                repoAppend({});
              }}
            >
              Add
            </Button>
          </Box>
        </Grid>
        <Typography variant='h2'>Iteration</Typography>
        {iterFields.map((field, index) => (
          <div key={field.id}>
            <Box my={1} p={1}>
              <Grid container spacing={1}>
                <MuiPickersUtilsProvider utils={LuxonUtils}>
                  <Grid item xs={5}>
                    <TextField
                      label='Iteration Name'
                      name={`iteration[${index}].name`}
                      variant='outlined'
                      inputRef={register()}
                      error={!!errors?.iteration?.[index]?.name}
                      helperText={errors?.iteration?.[index]?.name?.message}
                      defaultValue={field?.name}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <KeyboardDateTimePicker
                      variant='inline'
                      format='MM/dd/yyyy hh:mm a'
                      ampm={true}
                      margin='normal'
                      id='date-picker-inline'
                      label='Start Date'
                      value={startDate}
                      onChange={(startDate) =>
                        setValue('iteration.start', startDate)
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <KeyboardDateTimePicker
                      variant='inline'
                      format='MM/dd/yyyy hh:mm a'
                      ampm={true}
                      margin='normal'
                      id='date-picker-inline'
                      label='End Date'
                      value={endDate}
                      onChange={(endDate) => setValue('iteration.end', endDate)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Grid justify='flex-end' alignItems='center' container>
                      {index !== 0 && (
                        <IconButton onClick={() => iterSwap(index - 1, index)}>
                          <ArrowUpwardIcon />
                        </IconButton>
                      )}
                      {index !== repoFields.length - 1 && (
                        <IconButton onClick={() => iterSwap(index, index + 1)}>
                          <ArrowDownwardIcon />
                        </IconButton>
                      )}
                      <IconButton onClick={() => iterRemove(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>
            </Box>
            {index !== repoFields.length - 1 && (
              <Box position='relative' py={2}>
                <Divider variant='middle' />
                <Box position='absolute' top={-5} left='50%'>
                  <IconButton onClick={() => iterInsert(index + 1, {})}>
                    <AddCircleIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </div>
        ))}
        <Grid container justify='center' alignItems='center'>
          <Box mr={2}>
            <Button
              type='button'
              variant='contained'
              color='secondary'
              onClick={() => {
                iterAppend({
                  name: '',
                  start: DateTime.now().minus({ days: 7 }).toISO(),
                  end: DateTime.now().toISO(),
                });
              }}
            >
              Add
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </Box>
        </Grid>
      </form>
    </Box>
  );
};

export default Form;
