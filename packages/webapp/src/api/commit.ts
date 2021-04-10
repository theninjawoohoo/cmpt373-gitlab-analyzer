import {
  useApiQuery,
  SearchResults,
  usePaginatedQuery,
  useApiInfiniteQuery,
} from './base';
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
  not_associated_with_any_mr?: boolean;
}

export function useGetCountCommits(params: CommitSearchParams) {
  return useApiQuery<Commit.DailyCount[]>('/commit/count', params);
}

export function useGetCommits(
  params: CommitSearchParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<Commit>(`/commit`, params, page, pageSize);
}

export function useInfiniteCommit(params: CommitSearchParams, pageSize = 15) {
  return useApiInfiniteQuery<Commit>('/commit', params, pageSize);
}
