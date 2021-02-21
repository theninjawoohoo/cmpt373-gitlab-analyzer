import { SearchResults, useApiQuery } from './base';
import { MergeRequest } from '@ceres/types';

export function useMergeRequest(id: string) {
  return useApiQuery<SearchResults<MergeRequest>>(
    `/merge_request?repository=${id}&pageSize=50000`,
  );
}
