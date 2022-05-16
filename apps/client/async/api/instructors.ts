import axios from '../axios';

export const applyForInstructor = () => {
  return axios.post('/instructors/apply');
};
