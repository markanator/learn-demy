import axios from '../axios';

export const registerNewUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return axios.post('/auth/register', data);
};
