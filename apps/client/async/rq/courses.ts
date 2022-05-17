import { useQuery } from 'react-query';
import { getCourseBySlug } from '../api/courses';

export const useCourseBySlug = (slug?: string) => {
  return useQuery(
    ['course', slug],
    async () => {
      const response = await getCourseBySlug(slug);
      return response.data;
    },
    {
      enabled: !!slug,
    }
  );
};
