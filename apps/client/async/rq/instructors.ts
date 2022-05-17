import { useQuery } from 'react-query';
import { getInstructorAuthoredCourses } from '../api/instructors';

export const useInstructorAuthoredCourses = () => {
  return useQuery(['instructorCourses'], async () => {
    const { data } = await getInstructorAuthoredCourses();
    return data;
  });
};
