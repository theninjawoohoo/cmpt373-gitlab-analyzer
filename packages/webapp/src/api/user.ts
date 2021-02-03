import User from '../types/User';
import axios from '../util/axios';

export const getProfile = async () => {
  const response = await axios.get<User>('/user/profile');
  return response.data;
};
