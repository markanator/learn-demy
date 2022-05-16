import axios from '../axios';

export const applyForInstructor = () => {
  return axios.post('/instructors/apply');
};

export const getAccountStatus = async () => {
  return axios.get('/instructors/account-status');
};
