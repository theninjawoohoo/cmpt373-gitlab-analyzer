import { useApiMutation, useApiQuery } from './base';
import { Repository } from '@ceres/types';

export function useRepository() {
  return useApiQuery<Repository[]>('/repository');
}

export function usePostRepository() {
  return useApiMutation<null, null>('/repository', 'POST');
}
