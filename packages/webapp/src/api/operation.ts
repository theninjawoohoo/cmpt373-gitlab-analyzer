import { Operation } from '@ceres/types';
import { useApiMutation } from './base';

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

export function useCreateOperation<T extends OperationInput>() {
  return useApiMutation<Operation, T>('/operation', 'POST');
}
