import { SearchResults, useApiQuery, usePaginatedQuery } from './base';
import { MergeRequest } from '@ceres/types';

export function useMergeRequest(id: string) {
  return useApiQuery<SearchResults<MergeRequest>>(
    `/merge_request?repository=${id}&pageSize=50000`,
  );
}

interface MergeRequestSearchParams {
  repository: string;
  author_email?: string[];
}

export function useGetMergeRequests(
  params: MergeRequestSearchParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<MergeRequest>(
    '/merge_request',
    params,
    page,
    pageSize,
  );
}
