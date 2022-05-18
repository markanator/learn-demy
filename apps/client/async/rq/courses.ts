import { useQuery } from 'react-query';
import { getCourseBySlug } from '../api/courses';

export const useCourseBySlug = (slug?: string) => {
  return useQuery(
    ['course', slug],
    async () => {
      const { data } = await getCourseBySlug(slug);
      return data;
    },
    {
      enabled: !!slug,
    }
  );
};
