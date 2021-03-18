import {
  useApiMutation,
  useApiQuery,
  SearchResults,
  ApiResource,
} from './base';
import { Repository } from '@ceres/types';

interface QueryParams {
  name?: string;
  sort?: string;
  role?: Repository.Role[];
}

export function useRepository(params: QueryParams) {
  return useApiQuery<SearchResults<Repository>>('/repository', params);
}

export function useGetRepository(id: string) {
  return useApiQuery<ApiResource<Repository>>(`/repository/${id}`);
}

export function usePostRepository() {
  return useApiMutation<null, null>('/repository', 'POST');
}

export interface AddCollaboratorPayload {
  sfuId: string;
  accessLevel: Repository.AccessLevel;
}

export function useAddCollaborator(id: string) {
  return useApiMutation<ApiResource<Repository>, AddCollaboratorPayload>(
    `/repository/${id}/collaborator`,
    'POST',
  );
}

export interface RemoveCollaboratorPayload {
  collaboratorId: string;
}

export function useRemoveCollaborator(id: string) {
  return useApiMutation<ApiResource<Repository>, RemoveCollaboratorPayload>(
    `/repository/${id}/collaborator`,
    'DELETE',
  );
}
