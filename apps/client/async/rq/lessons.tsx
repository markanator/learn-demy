import { useMutation, useQueryClient } from 'react-query';
import { addLessonToCourse, removeVideoFromS3, updateLesson, uploadVideoToS3 } from '../api/courses';
import { COURSE_BY_SLUG_KEY } from './courses';

export const useAddLessonToCourse = () => {
  const client = useQueryClient();
  return useMutation(addLessonToCourse, {
    onSuccess: async () => {
      await client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};

export const useUpdateLesson = () => {
  const client = useQueryClient();
  return useMutation(updateLesson, {
    onSuccess: async () => {
      await client.invalidateQueries(COURSE_BY_SLUG_KEY);
      await client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};

export const useUploadVideoToS3 = () => {
  const client = useQueryClient();
  return useMutation(uploadVideoToS3, {
    onSuccess: async () => {
      await client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};

export const useRemoveVideoFromS3 = () => {
  const client = useQueryClient();
  return useMutation(removeVideoFromS3, {
    onSuccess: async () => {
      await client.invalidateQueries(COURSE_BY_SLUG_KEY);
    },
  });
};
