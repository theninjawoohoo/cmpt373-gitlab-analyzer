import { useApiQuery } from './base';
import { Repository } from '@ceres/types';

export function useRepository() {
  return useApiQuery<Repository[]>('/repository');
}
