import axios from '../util/axios';

export const loginSfu = async (ticket: string) => {
  const response = await axios.post<{
    access_token?: string;
  }>('/auth/login/sfu', { ticket });
  return response.data;
};
