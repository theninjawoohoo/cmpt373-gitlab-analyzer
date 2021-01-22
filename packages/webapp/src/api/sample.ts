import axios from '../util/axios';

export const getSample = async (): Promise<string> => {
  const res = await axios.get('/sample');
  return res.data;
};

