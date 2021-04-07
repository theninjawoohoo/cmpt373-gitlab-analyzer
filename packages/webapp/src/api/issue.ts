import { SearchResults, useApiQuery } from './base';
import { Issue } from '@ceres/types';

export function useGetIssueById(issueId) {
  return useApiQuery<Issue>(`/issue/${issueId}`);
}

export function useGetIssueByNoteId(issueId) {
  return useApiQuery<SearchResults<Issue>>(`/issue/${issueId}`);
}
