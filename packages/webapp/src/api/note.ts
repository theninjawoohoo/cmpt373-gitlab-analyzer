import { usePaginatedQuery } from './base';
import { Note } from '@ceres/types';

interface NoteSearchParams {
  merge_request?: string;
  issue?: string;
  author_email?: string[];
  start_date?: string;
  end_date?: string;
}

export function useGetNotes(
  params: NoteSearchParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<Note>(`/note`, params, page, pageSize);
}
