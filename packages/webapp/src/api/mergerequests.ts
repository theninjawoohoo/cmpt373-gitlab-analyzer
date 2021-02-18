import { useApiQuery } from './base';
import { MergeRequest } from '@ceres/types';

export function useMergeRequest() {
  return useApiQuery<MergeRequest[]>(
    `/merge_request/repository/e86c7bbf-6c95-4cec-9bb7-f108fbdbbe55`,
  );
}
