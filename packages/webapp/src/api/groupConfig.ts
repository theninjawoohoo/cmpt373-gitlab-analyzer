import { GroupConfig } from '@ceres/types';
import { ApiResource, useApiQuery, usePaginatedQuery } from './base';

export function useSearchGroupConfigs(page?: number, pageSize?: number) {
  return usePaginatedQuery<GroupConfig>('/group', {}, page, pageSize);
}

export function useGetScoringConfig(id: string) {
  return useApiQuery<ApiResource<GroupConfig>>(`/group/${id}`);
}
