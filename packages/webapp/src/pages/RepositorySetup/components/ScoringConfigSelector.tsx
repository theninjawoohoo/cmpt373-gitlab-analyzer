import { GlobWeight, Repository, ScoringConfig } from '@ceres/types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MuiLink from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiResource, SearchResults } from '../../../api/base';
import { useSearchScoringConfigs } from '../../../api/scoringConfig';
import SmartDate from '../../../components/SmartDate';
import { useRepositoryScoringContext } from '../RepositoryScoringContext';

interface ScoringConfigSelectorProps {
  isLoading?: boolean;
  onChange?: (config?: ApiResource<ScoringConfig>) => void;
  onSubmit?: (
    config?: ApiResource<ScoringConfig>,
    overrides?: GlobWeight[],
  ) => void;
  repository?: Repository;
  isOwner?: boolean;
  isEditor?: boolean;
}

function findConfigById(id: string, configs: SearchResults<ScoringConfig>) {
  return configs?.results?.find((config) => config.meta.id === id);
}

const ScoringConfigSelector: React.FC<ScoringConfigSelectorProps> = ({
  isLoading,
  onSubmit,
  repository,
  isEditor,
  isOwner,
}) => {
  const { data } = useSearchScoringConfigs(0, 1000);
  const [selectedScoringConfig, setSelectedScoringConfig] = useState(
    repository?.extensions?.scoringConfig?.id || 'None',
  );
  const {
    setShowDrawer,
    setOverrides,
    setShowCurrentConfig,
    overrides,
  } = useRepositoryScoringContext();

  const repositoryOverrides = repository?.extensions?.scoringConfig?.overrides;
  useEffect(() => {
    setOverrides(repositoryOverrides);
  }, [repositoryOverrides?.length]);

  const handleSubmit = () => {
    onSubmit(findConfigById(selectedScoringConfig, data), overrides || []);
  };

  const handleShowCurrentConfig = () => {
    setShowCurrentConfig(true);
    return false;
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
            <MuiLink
              underline='always'
              href='#'
              onClick={handleShowCurrentConfig}
            >
              <strong>
                {repository.extensions.scoringConfig?.config?.name || 'None'}
              </strong>
            </MuiLink>
          </Typography>
        </Grid>
      ) : (
        <Grid item>
          <Typography>This repository has never been evaluated.</Typography>
        </Grid>
      )}
      <Grid item>
        {isOwner && (
          <FormControl variant='filled'>
            <InputLabel id='selected-scoring-config'>Scoring Config</InputLabel>
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
        )}
      </Grid>
      {isEditor && (
        <Grid item>
          <Grid container direction='row' spacing={2}>
            <Grid item>
              <Button
                color='secondary'
                variant='contained'
                onClick={() => setShowDrawer(true)}
              >
                Overrides
              </Button>
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
          </Grid>
        </Grid>
      )}
      {isOwner && (
        <Grid item>
          <Typography>
            You can create and edit scoring configs{' '}
            <Link to='/settings/scoring'>here</Link>.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ScoringConfigSelector;
