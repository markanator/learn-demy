import axios from '../axios';

// USER DASHBOARD
export const getUserEnrolledCOurses = (userId: string) => {
  return axios.get(`/users/${userId}/enrolled-courses`);
};
export const getUserEnrolledCourse = (slug: string) => {
  return axios.get(`/users/course/${slug}`);
};
