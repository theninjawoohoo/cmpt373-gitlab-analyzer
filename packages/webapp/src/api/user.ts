import User from '../types/User';
import { useApiQuery } from './base';

export function useProfile() {
  return useApiQuery<User>('/user/profile');
}
