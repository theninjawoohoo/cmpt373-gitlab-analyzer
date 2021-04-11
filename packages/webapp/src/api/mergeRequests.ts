import {
  SearchResults,
  useApiInfiniteQuery,
  useApiQuery,
  usePaginatedQuery,
} from './base';
import { MergeRequest } from '@ceres/types';

export function useMergeRequest(id: string) {
  return useApiQuery<SearchResults<MergeRequest>>(
    `/merge_request?repository=${id}&pageSize=50000`,
  );
}

interface MergeRequestSearchParams {
  repository: string;
  author_email?: string[];
  merged_start_date?: string;
  merged_end_date?: string;
  note_id?: string;
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

export function useGetCountMergeRequests(params: MergeRequestSearchParams) {
  return useApiQuery<MergeRequest.DailyCount[]>('/merge_request/count', params);
}

export function useGetMergeRequestById(mergeRequestId) {
  return useApiQuery<MergeRequest>(`/merge_request/${mergeRequestId}`);
}

export function useGetMergeRequestByNoteId(params: MergeRequestSearchParams) {
  return useApiQuery<SearchResults<MergeRequest>>(
    `/merge_request?repository=${params.repository}&note_id=${params.note_id}`,
  );
}

export function useInfiniteMergeRequest(
  params: MergeRequestSearchParams,
  pageSize = 15,
) {
  return useApiInfiniteQuery<MergeRequest>('/merge_request', params, pageSize);
}
