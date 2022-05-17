import axios from '../axios';

export const applyForInstructor = () => {
  return axios.post('/instructors/apply');
};

export const getAccountStatus = async () => {
  return axios.get('/instructors/account-status');
};

export const getCurrentInstructors = async () => {
  return axios.get('/instructors/current-instructor');
};

export const getInstructorAuthoredCourses = async () => {
  return axios.get('/instructors/my-courses');
};
