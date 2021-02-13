import { useApiMutation } from './base';

interface AccessToken {
  access_token: string;
}

interface Ticket {
  ticket: string;
}

export function useLoginSfu() {
  return useApiMutation<AccessToken, Ticket>('/auth/login/sfu', 'POST');
}
