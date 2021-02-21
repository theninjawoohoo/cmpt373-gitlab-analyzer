import { Diff } from '@ceres/types';
import { usePaginatedQuery } from './base';

interface DiffSearchParams {
  commit?: string;
  merge_request?: string;
}

export function useGetDiffs(
  params: DiffSearchParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<Diff>(`/diff`, params, page, pageSize);
}
