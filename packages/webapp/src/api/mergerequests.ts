import { useApiQuery } from './base';
import { MergeRequest } from '@ceres/types';

export function useMergeRequest(id: string) {
  return useApiQuery<MergeRequest[]>(`/merge_request/repository/${id}`);
}
