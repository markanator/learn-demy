import axios from '../axios';

// USER DASHBOARD
export const getUserEnrolledCOurses = (userId: string) => {
  return axios.get(`/users/${userId}/enrolled-courses`);
};
