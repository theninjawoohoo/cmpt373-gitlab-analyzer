import { SearchResults, useApiQuery, usePaginatedQuery } from './base';
import { Note } from '@ceres/types';

interface NoteSearchParams {
  repository_id?: string;
  author_id?: number[];
  created_start_date?: string;
  created_end_date?: string;
}

export function useGetMergeRequestNotes(mergeRequestId: string) {
  return useApiQuery<SearchResults<Note>>(
    `/note?merge_request=${mergeRequestId}`,
    { pageSize: 5000 },
  );
}

export function useGetIssueNotes(issueId: string) {
  return useApiQuery<SearchResults<Note>>(`/note?issue=${issueId}`, {
    pageSize: 5000,
  });
}

export function useGetNotesByRepository(
  params: NoteSearchParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<Note>('/note', params, page, pageSize);
}

export function useGetWordCount(params: NoteSearchParams) {
  return useApiQuery<Note.DailyCount[]>('/note/count', params);
}
