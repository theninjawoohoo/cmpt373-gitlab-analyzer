import { useApiMutation } from './base';

interface UpdateScoringPayload {
  repositoryId: string;
  scoringConfigId?: string;
}

export function useUpdateScoring() {
  return useApiMutation<void, UpdateScoringPayload>('/scoring', 'POST');
}
