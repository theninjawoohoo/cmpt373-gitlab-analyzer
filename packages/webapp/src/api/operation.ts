import { Operation } from '@ceres/types';
import { useApiMutation, usePaginatedQuery } from './base';

interface OperationInput {
  type: Operation.Type;
}

export function useSyncRepository() {
  const mutation = useCreateOperation();
  const sync = (id: string) => {
    mutation.mutate(Operation.buildSyncRepositoryPayload(id));
  };
  return {
    ...mutation,
    sync,
  };
}

interface QueryParams {
  subscribers?: string[];
  type?: Operation.Type[];
  status?: Operation.Status[];
}

export function useGetOperations(
  params: QueryParams,
  page?: number,
  pageSize?: number,
) {
  return usePaginatedQuery<Operation>('/operation', params, page, pageSize);
}

export function useCreateOperation<T extends OperationInput>() {
  return useApiMutation<Operation, T>('/operation', 'POST');
}
