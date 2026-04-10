import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCourse,
  enrollInFreeCourse,
  getCourseBySlug,
  getPublishedCourse,
  getPublishedCourses,
  initiateCoursePurchase,
  removeInitialImage,
  toggleCoursePublished,
  updateCourse,
  uploadImageToS3,
  validateStripePurchase,
} from '../api/courses';
import { deleteLessonFromCourse } from '../api/lessons';
import { INSTRUCTOR_COURSES_KEY } from './instructors';

export const COURSES_KEY = 'courses';
export const COURSE_BY_SLUG_KEY = 'course';

export const usePublishedCourses = () => {
  return useQuery({
    queryKey: [COURSES_KEY],
    queryFn: async () => {
      const { data } = await getPublishedCourses();
      return data;
    },
  });
};

export const usePublishedCourseDetails = (slug: string) => {
  return useQuery({
    queryKey: [COURSE_BY_SLUG_KEY, slug],
    queryFn: async () => {
      const { data } = await getPublishedCourse(slug);
      return data;
    },
  });
};

export const useCourseBySlug = (slug?: string) => {
  return useQuery({
    queryKey: [COURSE_BY_SLUG_KEY, slug],
    queryFn: async () => {
      const { data } = await getCourseBySlug(slug);
      return data;
    },
    enabled: !!slug,
  });
};

export const useUploadImageMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: uploadImageToS3,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};

export const useRemoveImageMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: removeInitialImage,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};

export const useCreateCourseMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [INSTRUCTOR_COURSES_KEY] });
    },
  });
};

export const useUpdateCourseMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};

export const useToggleCoursePublishedMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: toggleCoursePublished,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};

export const useDeleteLessonFromCourseMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteLessonFromCourse,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [INSTRUCTOR_COURSES_KEY] });
      client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};

export const useFreeEnrollmentMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: enrollInFreeCourse,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};

export const usePurchaseCourseMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: initiateCoursePurchase,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};

export const useValidateStripePurchase = (courseId: string) => {
  return useQuery({
    queryKey: [COURSE_BY_SLUG_KEY, courseId],
    queryFn: async () => {
      const { data } = await validateStripePurchase({ courseId });
      return data;
    },
    enabled: !!courseId,
  });
};
