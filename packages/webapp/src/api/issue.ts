import { useApiQuery } from './base';
import { Issue } from '@ceres/types';

export function useGetIssueById(issueId) {
  return useApiQuery<Issue>(`/issue/${issueId}`);
}
