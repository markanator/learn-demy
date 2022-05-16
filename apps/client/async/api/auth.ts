import axios from '../axios';

export const registerNewUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return axios.post('/auth/register', data);
};

export const loginUser = async (data: { email: string; password: string }) => {
  return axios.post('/auth/login', data);
};

export const logoutUser = async () => {
  return axios.get('/auth/logout');
};

export const forgotPassword = async (data: { email: string }) => {
  return axios.post('/auth/forgot-password', data);
};

export const resetPassword = async (data: {
  email: string;
  code: string;
  newPassword: string;
}) => {
  return axios.post('/auth/reset-password', data);
};

export const getCurrentUser = async () => {
  return axios.get('/auth/me');
};
