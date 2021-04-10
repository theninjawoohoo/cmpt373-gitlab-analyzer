import { usePaginatedQuery } from './base';
import { Note } from '@ceres/types';

interface NoteSearchParams {
  merge_request?: string;
  issue?: string;
  author_email?: string[];
  start_date?: string;
  end_date?: string;
}

export function useGetMergeRequestNotes(
  params: NoteSearchParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<Note>(`/note`, params, page, pageSize);
}

export function useGetIssueNotes(
  params: NoteSearchParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<Note>(`/note`, params, page, pageSize);
}
