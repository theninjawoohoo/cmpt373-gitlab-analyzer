import { ApiResource, useApiMutation, useApiQuery } from './base';
import { RepositoryMember } from '@ceres/types';

export function useRepositoryMembers(id: string) {
  return useApiQuery<ApiResource<RepositoryMember>[]>(
    `/repository/${id}/members`,
  );
}

export function usePostRepositoryMembers(id: string) {
  return useApiMutation<null, null>(`/repository/${id}/members/sync`, 'POST');
}
