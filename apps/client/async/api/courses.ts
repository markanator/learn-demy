import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Course, IS3Image } from '../../types';
import axios from '../axios';

//* S3 CRUD
export const uploadImageToS3 = async (data: { image: string }) => {
  return axios.post('/courses/upload-image', data);
};

export const removeInitialImage = async (data: IS3Image) => {
  return axios.post('/courses/remove-image', data);
};

export const uploadVideoToS3 = async ({ data, config }: { data: FormData; config?: AxiosRequestConfig<FormData> }) => {
  return axios.post(`/courses/upload-video`, data, config);
};

export const removeVideoFromS3 = async (data: IS3Image) => {
  return axios.post('/courses/remove-video', data);
};

//* COURSE CRUD
export const createCourse = async (data: Record<string, unknown>) => {
  return axios.post('/courses', data);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCourse = async ({ courseSlug, data }: { courseSlug: string; data: Record<string, any> }) => {
  return axios.put(`/courses/${courseSlug}`, data);
};

export const getCourseBySlug = async (courseSlug: string): Promise<AxiosResponse<Course, Error>> => {
  return axios.get(`/courses/${courseSlug}`);
};

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
