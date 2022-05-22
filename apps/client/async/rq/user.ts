import { useQuery } from 'react-query';
import { getUserEnrolledCOurses } from '../api/users';

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
