import { User } from '@ceres/types';
import { useApiQuery } from './base';

export function useProfile() {
  return useApiQuery<User>('/user/profile');
}
