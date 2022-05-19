import { useQuery } from 'react-query';
import { getInstructorAuthoredCourses } from '../api/instructors';

export const INSTRUCTOR_COURSES_KEY = 'instructorCourses';

export const useInstructorAuthoredCourses = () => {
  return useQuery([INSTRUCTOR_COURSES_KEY], async () => {
    const { data } = await getInstructorAuthoredCourses();
    return data;
  });
};
