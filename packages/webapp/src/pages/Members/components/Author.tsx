import { Commit, RepositoryMember } from '@ceres/types';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { ApiResource } from '../../../api/base';

interface AuthorProps {
  author: Commit.Author;
  member?: ApiResource<RepositoryMember>;
  allMembers: ApiResource<RepositoryMember>[];
}

const Author: React.FC<AuthorProps> = ({ author, member, allMembers }) => {
  return (
    <Box my={4}>
      <Grid justify='space-between' alignItems='center' container>
        <Grid item>
          <Typography variant='h4'>{author.author_name}</Typography>
          <Typography variant='body1'>{author.author_email}</Typography>
        </Grid>
        <Grid item>
          <FormControl variant='filled'>
            <InputLabel>Member</InputLabel>
            <Select style={{ minWidth: '15rem' }} value={member?.meta.id}>
              {allMembers?.map((m) => (
                <MenuItem key={m.meta.id} value={m.meta.id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Author;
