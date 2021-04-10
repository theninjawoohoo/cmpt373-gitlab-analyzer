import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
// import LuxonUtils from '@date-io/luxon';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useRepository } from '../../../api/repository';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  GroupConfig,
  //Iteration,
  LinkedRepositories,
} from '@ceres/types';
// import {
//   MuiPickersUtilsProvider,
//   KeyboardDateTimePicker,
// } from '@material-ui/pickers';
import { DateTime } from 'luxon';
//import { SearchResults } from '../../../api/base';

const validationSchema = yup.object().shape({
  name: yup.string().required('A group config requires a name'),
});

interface FormProps {
  onSubmit: (values: GroupConfig) => void;
  defaultValues?: Partial<GroupConfig>;
}

const Form: React.FC<FormProps> = ({ defaultValues, onSubmit }) => {
  const { control, handleSubmit, register, errors } = useForm<GroupConfig>({
    defaultValues: {
      name: defaultValues?.name || '',
      iteration: defaultValues?.iteration || [
        {
          name: '',
          start: DateTime.now().minus({ days: 7 }).toISO(),
          end: DateTime.now().toISO(),
        },
      ],
      repositories: defaultValues?.repositories || [{}],
    },
    resolver: yupResolver(validationSchema),
  });

  const { data: data } = useRepository({
    name: '',
  });

  const blankLinkedRepo = { id: '', display: '' };

  const [repoState, setRepoState] = useState(blankLinkedRepo);
  const handleRepoChange = (e) => {
    const { display, id } = e.target;
    setRepoState((prevState) => ({
      ...prevState,
      [display]: id,
    }));
  };

  // const {
  //   fields: iterFields,
  //   append: iterAppend,
  //   remove: iterRemove,
  //   swap: iterSwap,
  //   insert: iterInsert,
  // } = useFieldArray<Iteration>({
  //   control,
  //   name: 'iteration',
  // });

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
                    <InputLabel>Show results for:</InputLabel>
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
                    value={repoState[field?.display]}
                    name={`repositories[${index}].id`}
                    variant='outlined'
                    inputRef={register()}
                    defaultValue={field?.id}
                    fullWidth
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
      </form>
    </Box>
  );
};

export default Form;
