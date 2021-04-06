import { SearchResults, useApiQuery } from './base';
import { Note } from '@ceres/types';

// interface NoteSearchParams {
//   merge_request?: string;
//   issue?: string;
// }

export function useGetMergeRequestNotes(mergeRequestId: string) {
  return useApiQuery<SearchResults<Note>>(
    `/note?merge_request=${mergeRequestId}`,
    { pageSize: 5000 },
  );
}
