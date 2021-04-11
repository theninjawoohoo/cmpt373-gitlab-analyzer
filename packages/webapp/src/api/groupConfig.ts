import { GroupConfig } from '@ceres/types';
import {
  ApiResource,
  useApiMutation,
  useApiQuery,
  usePaginatedQuery,
  SearchResults,
} from './base';

interface GroupSearchParams {
  repo_id?: string;
}

export function useGetIterations(params: GroupSearchParams) {
  return useApiQuery<SearchResults<GroupConfig>>('/group', params);
}

export function useSearchGroupConfigs(page?: number, pageSize?: number) {
  return usePaginatedQuery<GroupConfig>('/group', {}, page, pageSize);
}

export function useGetGroupConfig(id: string) {
  return useApiQuery<ApiResource<GroupConfig>>(`/group/${id}`);
}

export function useCreateGroupConfig() {
  return useApiMutation<ApiResource<GroupConfig>, GroupConfig>(
    '/group',
    'POST',
  );
}

export function useUpdateGroupConfig(id: string) {
  return useApiMutation<ApiResource<GroupConfig>, GroupConfig>(
    `/group/${id}`,
    'PUT',
  );
}
