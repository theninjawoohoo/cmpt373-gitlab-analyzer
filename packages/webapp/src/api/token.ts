import { useApiMutation, useApiQuery } from './base';

export function usePostToken() {
  return useApiMutation<null, { token: string }>('/token', 'POST');
}

export function useVerifyToken() {
  return useApiQuery<{ verified: boolean }>('/token/verify');
}
