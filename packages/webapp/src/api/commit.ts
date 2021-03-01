import {
  useApiQuery,
  SearchResults,
  usePaginatedQuery,
  useDateApiQuery,
} from './base';
import { Commit } from '@ceres/types';

interface DailyCommitSearchParams {
  repository: string;
  author_email?: string;
  start_date?: string;
  end_date?: string;
}

export function useCommitDailyCounts(
  params: DailyCommitSearchParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<Commit.DailyCount>(
    '/commit/daily_count',
    params,
    page,
    pageSize,
  );
}

export function useCommitsForMergeRequest(mergeRequestId: string) {
  return useApiQuery<SearchResults<Commit>>(
    `/commit?merge_request=${mergeRequestId}`,
  );
}

interface CommitSearchParams {
  repository?: string;
  merge_request?: string;
  author_email?: string[];
}

export function useGetCommits(
  params: CommitSearchParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<Commit>(`/commit`, params, page, pageSize);
}

interface DateCommitSearchQuery {
  repository?: string;
  start_date?: string;
  end_date?: string;
}

export function useDateFilterCommits(params: DateCommitSearchQuery) {
  return useDateApiQuery<SearchResults<Commit>>(`/commit`, params);
}
