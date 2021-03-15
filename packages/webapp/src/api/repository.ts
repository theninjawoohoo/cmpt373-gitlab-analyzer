import {
  useApiMutation,
  useApiQuery,
  SearchResults,
  ApiResource,
} from './base';
import { Repository } from '@ceres/types';

interface QueryParams {
  sort?: string;
}

export function useRepository(params: QueryParams) {
  return useApiQuery<SearchResults<Repository>>('/repository', params);
}

export function useGetRepository(id: string) {
  return useApiQuery<ApiResource<Repository>>(`/repository/${id}`);
}

export function usePostRepository() {
  return useApiMutation<null, null>('/repository', 'POST');
}
