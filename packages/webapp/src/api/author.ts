import { useApiQuery, ApiResource } from './base';
import { Commit } from '@ceres/types';

export function useRepositoryAuthors(id: string) {
  return useApiQuery<ApiResource<Commit.Author>[]>(`/repository/${id}/authors`);
}
