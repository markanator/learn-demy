import axios from '../axios';

//* LESSONS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addLessonToCourse = async ({ courseSlug, data }: { courseSlug: string; data: Record<string, any> }) => {
  return axios.post(`/courses/${courseSlug}/lessons`, data);
};

export const updateLesson = async ({
  courseSlug,
  lessonId,
  data,
}: {
  courseSlug: string;
  lessonId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}) => {
  return axios.put(`/courses/${courseSlug}/lessons/${lessonId}`, data);
};

export const deleteLessonFromCourse = async ({ courseSlug, lessonId }: { courseSlug: string; lessonId: string }) => {
  return axios.delete(`/courses/${courseSlug}/lessons/${lessonId}`);
};
