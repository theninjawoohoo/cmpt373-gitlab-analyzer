import {
  useApiMutation,
  useApiQuery,
  SearchResults,
  ApiResource,
} from './base';
import { Repository } from '@ceres/types';

export function useRepository() {
  return useApiQuery<SearchResults<Repository>>('/repository');
}

export function useGetRepository(id: string) {
  return useApiQuery<ApiResource<Repository>>(`/repository/${id}`);
}

export function usePostRepository() {
  return useApiMutation<null, null>('/repository', 'POST');
}
