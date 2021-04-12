import { Repository } from '@ceres/types';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ApiResource } from '../../../api/base';
import { useRepository } from '../../../api/repository';

const ListContainer = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 20rem;
`;

interface RepositorySelectorProps {
  repositoriesSelected: string[];
  onRepositoryAdd: (repository: ApiResource<Repository>) => void;
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  repositoriesSelected,
  onRepositoryAdd,
}) => {
  const [sort, setSort] = useState('-project_created');
  const [search, setSearch] = useState('');
  const { data } = useRepository({
    sort,
    name: search,
  });
  const repositories = (data?.results || []).filter(
    (repository) => !repositoriesSelected.includes(repository.meta.id),
  );

  return (
    <Box py={2}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            label='Search'
            variant='outlined'
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl variant='filled' fullWidth>
            <InputLabel shrink id='sort-order-label'>
              Sort
            </InputLabel>
            <Select
              labelId='sort-order-label'
              id='sort-order-label-options'
              value={sort}
              onChange={(e) => setSort(e.target.value as string)}
              style={{ minWidth: '15rem' }}
              fullWidth
            >
              <MenuItem value='-project_synced'>Recently Synced</MenuItem>
              <MenuItem value='+project_synced'>Oldest Synced</MenuItem>
              <MenuItem value='-project_created'>Recently Created</MenuItem>
              <MenuItem value='+project_created'>Oldest Created</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <ListContainer>
        {repositories.map((repository) => (
          <Box key={repository.meta.id} py={1}>
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <IconButton onClick={() => onRepositoryAdd(repository)}>
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography>{repository.name_with_namespace}</Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </ListContainer>
    </Box>
  );
};

export default RepositorySelector;
