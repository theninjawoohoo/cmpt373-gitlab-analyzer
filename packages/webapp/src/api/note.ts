import { SearchResults, useApiQuery } from './base';
import { Note } from '@ceres/types';

// interface NoteSearchParams {
//   merge_request?: string;
//   issue?: string;
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
  return useApiQuery<SearchResults<Note>>(`/note?issue=${issueId}`);
}

export function useGetNotesByRepository(repository_Id: string) {
  return useApiQuery<SearchResults<Note>>(
    `/note?repository_id=${repository_Id}`,
    { pageSize: 5000 },
  );
}
