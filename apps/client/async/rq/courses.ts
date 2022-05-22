import { useMutation, useQuery, useQueryClient } from 'react-query';
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
  return useQuery([COURSES_KEY], async () => {
    const { data } = await getPublishedCourses();
    return data;
  });
};

export const usePublishedCourseDetails = (slug: string) => {
  return useQuery([COURSE_BY_SLUG_KEY, slug], async () => {
    const { data } = await getPublishedCourse(slug);
    return data;
  });
};

export const useCourseBySlug = (slug?: string) => {
  return useQuery(
    [COURSE_BY_SLUG_KEY, slug],
    async () => {
      const { data } = await getCourseBySlug(slug);
      return data;
    },
    {
      enabled: !!slug,
    }
  );
};

export const useUploadImageMutation = () => {
  const client = useQueryClient();
  return useMutation(uploadImageToS3, {
    onSuccess: () => {
      client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};

export const useRemoveImageMutation = () => {
  const client = useQueryClient();
  return useMutation(removeInitialImage, {
    onSuccess: () => {
      client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};

export const useCreateCourseMutation = () => {
  const client = useQueryClient();
  return useMutation(createCourse, {
    onSuccess: () => {
      client.invalidateQueries(INSTRUCTOR_COURSES_KEY);
    },
  });
};

export const useUpdateCourseMutation = () => {
  const client = useQueryClient();
  return useMutation(updateCourse, {
    onSuccess: () => {
      client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};

export const useToggleCoursePublishedMutation = () => {
  const client = useQueryClient();
  return useMutation(toggleCoursePublished, {
    onSuccess: () => {
      client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};

export const useDeleteLessonFromCourseMutation = () => {
  const client = useQueryClient();
  return useMutation(deleteLessonFromCourse, {
    onSuccess: () => {
      client.invalidateQueries(INSTRUCTOR_COURSES_KEY);
      client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};

export const useFreeEnrollmentMutation = () => {
  const client = useQueryClient();
  return useMutation(enrollInFreeCourse, {
    onSuccess: () => {
      client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};

export const usePurchaseCourseMutation = () => {
  const client = useQueryClient();
  return useMutation(initiateCoursePurchase, {
    onSuccess: () => {
      client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};

export const useValidateStripePurchase = (courseId: string) => {
  return useQuery(
    [COURSE_BY_SLUG_KEY, courseId],
    async () => {
      const { data } = await validateStripePurchase({ courseId });
      return data;
    },
    {
      enabled: !!courseId,
    }
  );
};
