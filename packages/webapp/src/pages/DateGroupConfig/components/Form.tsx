import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  GroupConfig,
  Iteration,
  LinkedRepositories,
  Repository,
} from '@ceres/types';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { DateTime } from 'luxon';
import RepositorySelector from './RepositorySelector';
import { ApiResource } from '../../../api/base';

const validationSchema = yup.object().shape({
  name: yup.string().required('A group config requires a name'),
  repositories: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        display: yup.string().required(),
      }),
    ),
  iteration: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        name: yup.string().required('Iteration Name is required'),
        start: yup.string().typeError('Something is wrong with Date field'),
        end: yup.string().typeError('Something is wrong with Date field'),
      }),
    ),
});

interface FormProps {
  onSubmit: (values: GroupConfig) => void;
  defaultValues?: Partial<GroupConfig>;
}

const Form: React.FC<FormProps> = ({ defaultValues, onSubmit }) => {
  const { control, handleSubmit, register, errors } = useForm<GroupConfig>({
    defaultValues: {
      name: defaultValues?.name || '',
      iteration: defaultValues?.iteration || [],
      repositories: defaultValues?.repositories || [],
    },
    resolver: yupResolver(validationSchema),
  });

  const {
    fields: repoFields,
    append: repoAppend,
    remove: repoRemove,
  } = useFieldArray<LinkedRepositories>({
    control,
    name: 'repositories',
    keyName: 'identifier' as any,
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

  const onRepositoryAdd = (repository: ApiResource<Repository>) => {
    repoAppend({
      id: repository.meta.id,
      display: repository.name_with_namespace,
    });
  };

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
          <Box py={1} key={field.id}>
            <input
              type='hidden'
              name={`repositories[${index}].id`}
              ref={register()}
              defaultValue={field?.id}
            />
            <input
              type='hidden'
              name={`repositories[${index}].display`}
              ref={register()}
              defaultValue={field?.display}
            />
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <IconButton onClick={() => repoRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography>{field.display}</Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
        <RepositorySelector
          onRepositoryAdd={onRepositoryAdd}
          repositoriesSelected={(repoFields || []).map((repo) => repo.id)}
        />
        <Typography variant='h2'>Iterations</Typography>
        {iterFields.map((field, index) => (
          <div key={field.id}>
            <Box my={1} p={1}>
              <Grid container spacing={1} alignItems='center'>
                <Grid item xs={3}>
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
                <Grid item xs={3}>
                  <Controller
                    render={({ ref, ...props }) => {
                      return (
                        <KeyboardDateTimePicker
                          variant='inline'
                          inputVariant='outlined'
                          format='MM/dd/yyyy hh:mm a'
                          ampm={true}
                          label='Start Date'
                          inputRef={ref}
                          {...props}
                        />
                      );
                    }}
                    control={control}
                    name={`iteration[${index}].start`}
                    defaultValue={field?.start}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    render={({ ref, ...props }) => {
                      return (
                        <KeyboardDateTimePicker
                          variant='inline'
                          inputVariant='outlined'
                          format='MM/dd/yyyy hh:mm a'
                          ampm={true}
                          label='End Date'
                          inputRef={ref}
                          {...props}
                        />
                      );
                    }}
                    control={control}
                    name={`iteration[${index}].end`}
                    defaultValue={field?.end}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Grid justify='flex-end' alignItems='center' container>
                    {index !== 0 && (
                      <IconButton onClick={() => iterSwap(index - 1, index)}>
                        <ArrowUpwardIcon />
                      </IconButton>
                    )}
                    {index !== iterFields.length - 1 && (
                      <IconButton onClick={() => iterSwap(index, index + 1)}>
                        <ArrowDownwardIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => iterRemove(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            {index !== iterFields.length - 1 && (
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
        <Grid
          container
          justify='center'
          alignItems='center'
          spacing={2}
          direction='column'
        >
          <Grid item>
            <Button
              type='button'
              variant='contained'
              color='secondary'
              onClick={() => {
                iterAppend({
                  name: '',
                  start: DateTime.now().minus({ days: 7 }).toISO(),
                  end: DateTime.now().minus({ days: 0 }).toISO(),
                });
              }}
            >
              Add Iteration
            </Button>
          </Grid>
          <Grid item>
            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Form;
