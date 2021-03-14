import { ScoringConfig } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchScoringConfigs } from '../../../api/scoringConfig';

interface ScoringConfigSelectorProps {
  onChange?: (config: ScoringConfig) => void;
}

const ScoringConfigSelector: React.FC<ScoringConfigSelectorProps> = () => {
  const { data } = useSearchScoringConfigs(0, 1000);
  const [selectedScoringConfig, setSelectedScoringConfig] = useState('None');
  return (
    <Paper>
      <Box p={2}>
        <Typography variant='h2'>Scoring Config</Typography>
        <Grid container spacing={3} alignItems='center' direction='column'>
          <Grid item>
            <FormControl variant='filled'>
              <InputLabel id='selected-scoring-config'>
                Scoring Config
              </InputLabel>
              <Select
                style={{ minWidth: '15rem' }}
                labelId='selected-scoring-config'
                value={selectedScoringConfig}
                onChange={(e) =>
                  setSelectedScoringConfig(e.target.value as string)
                }
              >
                <MenuItem value='None'>None</MenuItem>
                {(data?.results || []).map((scoringConfig) => (
                  <MenuItem
                    key={scoringConfig.meta.id}
                    value={scoringConfig.meta.id}
                  >
                    {scoringConfig.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button color='primary' variant='contained'>
              Evaluate
            </Button>
          </Grid>
          <Grid item>
            <Typography>
              You can create and edit scoring configs{' '}
              <Link to='/scoring'>here</Link>.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ScoringConfigSelector;
