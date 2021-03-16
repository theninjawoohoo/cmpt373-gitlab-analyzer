import { Repository } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { AddCollaboratorPayload } from '../../../api/repository';
import { ApiResource } from '../../../api/base';

const NoCollaborators = () => (
  <Typography>There are no collaborators in this project</Typography>
);

interface CollaboratorsProps {
  repository?: ApiResource<Repository>;
  onAddCollaborator?: (payload: AddCollaboratorPayload) => void;
}

const AddCollaboratorForm = ({
  handleAdd,
}: {
  handleAdd: CollaboratorsProps['onAddCollaborator'];
}) => {
  const [accessLevel, setAccessLevel] = useState(Repository.AccessLevel.editor);
  const [sfuId, setSfuId] = useState('');

  const onSubmit = () => {
    handleAdd({
      sfuId,
      accessLevel,
    });
  };

  return (
    <Grid container direction='column' spacing={2}>
      <Grid item>
        <TextField
          label='SFU id'
          variant='outlined'
          fullWidth
          value={sfuId}
          onChange={(e) => setSfuId(e.target.value)}
        />
      </Grid>
      <Grid item>
        <FormControl variant='filled' fullWidth>
          <InputLabel shrink id='access-level-select'>
            Access Level
          </InputLabel>
          <Select
            labelId='access-level'
            id='access-level-select'
            style={{ minWidth: '15rem' }}
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value as any)}
            fullWidth
          >
            {Object.values(Repository.AccessLevel).map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <Box textAlign='center'>
          <Button variant='contained' color='primary' onClick={onSubmit}>
            Add
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

const Collaborators: React.FC<CollaboratorsProps> = ({
  onAddCollaborator,
  repository,
}) => {
  const collaborators = repository?.extensions?.collaborators || [];
  return (
    <Paper>
      <Box p={2}>
        <Typography variant='h2'>Collaborators</Typography>
        <Grid container>
          <Grid item xs={6}>
            {collaborators.length > 0 ? (
              <div>Here be members.</div>
            ) : (
              <NoCollaborators />
            )}
          </Grid>
          <Grid item xs={6}>
            <Container maxWidth='xs'>
              <AddCollaboratorForm handleAdd={onAddCollaborator} />
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Collaborators;
