import { useQuery } from '@tanstack/react-query';
import { getUserEnrolledCourse, getUserEnrolledCOurses } from '../api/users';

export const useGetUserEnrolledCourses = (userid: string) => {
  return useQuery({
    queryKey: ['userCourses', userid],
    queryFn: async () => {
      const { data } = await getUserEnrolledCOurses(userid);
      return data;
    },
    enabled: !!userid,
  });
};

export const useEnrolledCourseDetails = (slug: string) => {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data } = await getUserEnrolledCourse(slug);
      return data;
    },
    enabled: !!slug,
  });
};
