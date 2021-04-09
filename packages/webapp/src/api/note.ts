import { SearchResults, useApiQuery } from './base';
import { Note } from '@ceres/types';

// interface NoteSearchParams {
//   repository: string;
//   author_email?: string[];
//   start_date?: string;
//   end_date?: string;
// }

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

export function useGetNotesByRepository(repository_id: string) {
  return useApiQuery<SearchResults<Note>>(
    `/note?repository_id=${repository_id}`,
    { pageSize: 5000 },
  );
}
