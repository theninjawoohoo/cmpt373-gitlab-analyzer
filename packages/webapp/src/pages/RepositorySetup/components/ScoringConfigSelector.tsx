import { Repository, ScoringConfig } from '@ceres/types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiResource, SearchResults } from '../../../api/base';
import { useSearchScoringConfigs } from '../../../api/scoringConfig';
import SmartDate from '../../../components/SmartDate';

interface ScoringConfigSelectorProps {
  isLoading?: boolean;
  onChange?: (config?: ApiResource<ScoringConfig>) => void;
  onSubmit?: (config?: ApiResource<ScoringConfig>) => void;
  repository?: Repository;
}

function findConfigById(id: string, configs: SearchResults<ScoringConfig>) {
  return configs?.results?.find((config) => config.meta.id === id);
}

const ScoringConfigSelector: React.FC<ScoringConfigSelectorProps> = ({
  isLoading,
  onSubmit,
  repository,
}) => {
  const { data } = useSearchScoringConfigs(0, 1000);
  const [selectedScoringConfig, setSelectedScoringConfig] = useState(
    repository?.extensions?.scoringConfig?.id || 'None',
  );

  const handleSubmit = () => {
    onSubmit(findConfigById(selectedScoringConfig, data));
  };

  return (
    <Grid container spacing={3} alignItems='center' direction='column'>
      {repository?.extensions?.scoringConfig?.lastRan ? (
        <Grid item>
          <Typography>
            Last evaluated at{' '}
            <strong>
              <SmartDate>
                {repository.extensions.scoringConfig.lastRan}
              </SmartDate>
            </strong>{' '}
            with config:{' '}
            <strong>
              {repository.extensions.scoringConfig?.config?.name || 'None'}
            </strong>
          </Typography>
        </Grid>
      ) : (
        <Grid item>
          <Typography>This repository has never been evaluated.</Typography>
        </Grid>
      )}
      <Grid item>
        <FormControl variant='filled'>
          <InputLabel id='selected-scoring-config'>Scoring Config</InputLabel>
          <Select
            style={{ minWidth: '15rem' }}
            labelId='selected-scoring-config'
            value={selectedScoringConfig}
            onChange={(e) => setSelectedScoringConfig(e.target.value as string)}
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
        <Button
          color='primary'
          variant='contained'
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Evaluate
        </Button>
      </Grid>
      <Grid item>
        <Typography>
          You can create and edit scoring configs{' '}
          <Link to='/settings/scoring'>here</Link>.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ScoringConfigSelector;
