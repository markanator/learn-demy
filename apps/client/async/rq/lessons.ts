import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeVideoFromS3, uploadVideoToS3 } from '../api/courses';
import { addLessonToCourse, updateLesson } from '../api/lessons';
import { COURSE_BY_SLUG_KEY } from './courses';

export const useAddLessonToCourse = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: addLessonToCourse,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};

export const useUpdateLesson = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateLesson,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};

export const useUploadVideoToS3 = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: uploadVideoToS3,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};

export const useRemoveVideoFromS3 = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: removeVideoFromS3,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [COURSE_BY_SLUG_KEY] });
    },
  });
};
