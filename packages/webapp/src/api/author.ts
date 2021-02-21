import { useApiQuery, ApiResource, useApiMutation } from './base';
import { Commit, RepositoryMember } from '@ceres/types';

export function useRepositoryAuthors(id: string) {
  return useApiQuery<ApiResource<Commit.Author>[]>(`/repository/${id}/authors`);
}

export function useLinkAuthorToMember(author: string) {
  return useApiMutation<ApiResource<Commit.Author>, RepositoryMember>(
    `/repository/author/${author}/member`,
    'PUT',
  );
}
