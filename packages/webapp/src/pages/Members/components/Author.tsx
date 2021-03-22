import { Commit, RepositoryMember } from '@ceres/types';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useLinkAuthorToMember } from '../../../api/author';
import { ApiResource } from '../../../api/base';

interface AuthorProps {
  author: ApiResource<Commit.Author>;
  member?: ApiResource<RepositoryMember>;
  allMembers: ApiResource<RepositoryMember>[];
}

function compareMember(a: RepositoryMember, b: RepositoryMember) {
  return a.username.localeCompare(b.username);
}

const Author: React.FC<AuthorProps> = ({ author, member, allMembers }) => {
  const { mutate, isLoading } = useLinkAuthorToMember(author.meta.id);
  const [value, setValue] = useState<string>();
  useEffect(() => {
    setValue(member?.meta.id);
  }, [member?.meta.id]);
  useEffect(() => {
    const newMember = allMembers.find((m) => m.meta.id === value);
    if (newMember && member?.meta.id !== newMember.meta.id) {
      mutate(newMember);
    }
  }, [value]);
  return (
    <Box my={4}>
      <Grid justify='space-between' alignItems='center' container>
        <Grid item>
          <Typography variant='h4'>{author.author_name}</Typography>
          <Typography variant='body1'>{author.author_email}</Typography>
        </Grid>
        <Grid item>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <FormControl variant='filled'>
              <InputLabel>Member</InputLabel>
              <Select
                style={{ minWidth: '18rem' }}
                value={value || 'None'}
                onChange={(e) => {
                  e.preventDefault();
                  setValue(e.target.value as string);
                }}
              >
                {allMembers?.sort(compareMember)?.map((m) => (
                  <MenuItem key={m.meta.id} value={m.meta.id}>
                    {m.username} - {m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Author;
