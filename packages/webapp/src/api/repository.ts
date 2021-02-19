import { useApiMutation, useApiQuery, SearchResults } from './base';
import { Repository } from '@ceres/types';

export function useRepository() {
  return useApiQuery<SearchResults<Repository>>('/repository');
}

export function usePostRepository() {
  return useApiMutation<null, null>('/repository', 'POST');
}
