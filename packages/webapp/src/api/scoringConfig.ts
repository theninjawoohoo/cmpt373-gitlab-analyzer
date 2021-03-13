import { ScoringConfig } from '@ceres/types';
import {
  ApiResource,
  useApiMutation,
  useApiQuery,
  usePaginatedQuery,
} from './base';

export function useSearchScoringConfigs(page?: number, pageSize?: number) {
  return usePaginatedQuery<ScoringConfig>(
    '/scoring_config',
    {},
    page,
    pageSize,
  );
}

export function useGetScoringConfig(id: string) {
  return useApiQuery<ApiResource<ScoringConfig>>(`/scoring_config/${id}`);
}

export function useCreateScoringConfig() {
  return useApiMutation<ApiResource<ScoringConfig>, ScoringConfig>(
    '/scoring_config',
    'POST',
  );
}
