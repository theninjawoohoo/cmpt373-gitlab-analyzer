import { useApiQuery, SearchResults, usePaginatedQuery } from './base';
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

export function useCommitsForRepository(
  repoId: string,
  page?: number,
  pageSize?: number,
) {
  console.log({ page });
  return usePaginatedQuery<Commit>(
    `/commit?repository=${repoId}`,
    {},
    page,
    pageSize,
  );
}
