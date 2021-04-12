import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { GlobWeight, ScoringConfig } from '@ceres/types';

const makeValidationSchema = (requireName?: boolean) => {
  return yup.object().shape({
    name: requireName
      ? yup.string().required('A scoring config requires a name')
      : yup.string(),
    weights: yup.array().of(
      yup.object().shape({
        glob: yup.string().required('Glob is required'),
        weight: yup
          .number()
          .typeError('Weight must be a number')
          .required('Weight is required')
          .min(0, 'Weight cannot be below 0'),
      }),
    ),
  });
};

interface FormProps {
  onSubmit: (values: ScoringConfig) => void;
  defaultValues?: Partial<ScoringConfig>;
  requireName?: boolean;
}

const ScoringConfigForm: React.FC<FormProps> = ({
  defaultValues,
  onSubmit,
  requireName,
}) => {
  const { control, handleSubmit, register, errors } = useForm<ScoringConfig>({
    defaultValues: {
      name: defaultValues?.name || '',
      weights: defaultValues?.weights || [{}], // give one empty glob config to start
    },
    resolver: yupResolver(makeValidationSchema(requireName)),
  });
  const { fields, append, remove, swap, insert } = useFieldArray<GlobWeight>({
    control,
    name: 'weights',
  });

  return (
    <form
      autoComplete='off'
      spellCheck={false}
      onSubmit={handleSubmit(onSubmit)}
    >
      {requireName && (
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
      )}
      <Typography variant='h2'>Filetype Scaling</Typography>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Box my={1} p={1}>
            <Grid container spacing={1}>
              <Grid item xs={7}>
                <TextField
                  label='File Pattern'
                  name={`weights[${index}].glob`}
                  variant='outlined'
                  inputRef={register()}
                  error={!!errors?.weights?.[index]?.glob}
                  helperText={errors?.weights?.[index]?.glob?.message}
                  defaultValue={field?.glob}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label='Weight'
                  name={`weights[${index}].weight`}
                  variant='outlined'
                  inputRef={register()}
                  error={!!errors?.weights?.[index]?.weight}
                  helperText={errors?.weights?.[index]?.weight?.message}
                  defaultValue={field?.weight}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <Grid justify='flex-end' alignItems='center' container>
                  {index !== 0 && (
                    <IconButton onClick={() => swap(index - 1, index)}>
                      <ArrowUpwardIcon />
                    </IconButton>
                  )}
                  {index !== fields.length - 1 && (
                    <IconButton onClick={() => swap(index, index + 1)}>
                      <ArrowDownwardIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          {index !== fields.length - 1 && (
            <Box position='relative' py={2}>
              <Divider variant='middle' />
              <Box position='absolute' top={-5} left='50%'>
                <IconButton onClick={() => insert(index + 1, {})}>
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
            variant='outlined'
            color='primary'
            onClick={() => {
              append({});
            }}
          >
            Add
          </Button>
        </Box>
        <Button type='submit' variant='contained' color='primary'>
          Submit
        </Button>
      </Grid>
    </form>
  );
};

export default ScoringConfigForm;
