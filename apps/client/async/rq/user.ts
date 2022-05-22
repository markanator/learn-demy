import { useQuery } from 'react-query';
import { getUserEnrolledCourse, getUserEnrolledCOurses } from '../api/users';

export const useGetUserEnrolledCourses = (userid: string) => {
  return useQuery(
    ['userCourses', userid],
    async () => {
      const { data } = await getUserEnrolledCOurses(userid);
      return data;
    },
    {
      enabled: !!userid,
    }
  );
};

export const useEnrolledCourseDetails = (slug: string) => {
  return useQuery(
    ['course', slug],
    async () => {
      const { data } = await getUserEnrolledCourse(slug);
      return data;
    },
    {
      enabled: !!slug,
    }
  );
};
