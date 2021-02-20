import { useApiQuery, SearchResults } from './base';
import { Commit } from '@ceres/types';

export function useCommitsForMergeRequest(mergeRequestId: string) {
  return useApiQuery<SearchResults<Commit>>(
    `/commit?merge_request=${mergeRequestId}`,
  );
}
