import { useQuery } from '@tanstack/react-query';
import { getInstructorAuthoredCourses } from '../api/instructors';

export const INSTRUCTOR_COURSES_KEY = 'instructorCourses';

export const useInstructorAuthoredCourses = () => {
  return useQuery({
    queryKey: [INSTRUCTOR_COURSES_KEY],
    queryFn: async () => {
      const { data } = await getInstructorAuthoredCourses();
      return data;
    },
  });
};
