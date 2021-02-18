import { useApiQuery } from './base';
import { MergeRequest } from '@ceres/types';

export function useMergeRequest() {
  return useApiQuery<MergeRequest[]>('/mergerequest');
}
