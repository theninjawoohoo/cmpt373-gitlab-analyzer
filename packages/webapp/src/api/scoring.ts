import { GlobWeight, StagedScoreOverride } from '@ceres/types';
import { useApiMutation } from './base';

interface UpdateScoringPayload {
  repositoryId: string;
  scoringConfigId?: string;
  overrides?: GlobWeight[];
}

interface UpdateScoreOverridesPayload {
  repositoryId: string;
  overrides: StagedScoreOverride[];
}

export function useUpdateScoring() {
  return useApiMutation<void, UpdateScoringPayload>('/scoring', 'POST');
}

export function useUpdateScoreOverrides() {
  return useApiMutation<void, UpdateScoreOverridesPayload>(
    '/scoring/override',
    'POST',
  );
}
