import { useApiQuery, SearchResults, usePaginatedQuery } from './base';
import { Commit } from '@ceres/types';

export function useCommitsForMergeRequest(mergeRequestId: string) {
  return useApiQuery<SearchResults<Commit>>(
    `/commit?merge_request=${mergeRequestId}`,
  );
}

interface CommitSearchParams {
  repository?: string;
  merge_request?: string;
  author_email?: string[];
  start_date?: string;
  end_date?: string;
  sort?: string;
}

export function useGetCommits(
  params: CommitSearchParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<Commit>(`/commit`, params, page, pageSize);
}
