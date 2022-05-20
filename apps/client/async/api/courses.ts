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

export const uploadVideoToS3 = async (data: FormData, config?: AxiosRequestConfig<FormData>) => {
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
export const updateCourse = async ({ slug, data }: { slug: string; data: Record<string, any> }) => {
  return axios.put(`/courses/${slug}`, data);
};

export const getCourseBySlug = async (slug: string): Promise<AxiosResponse<Course, Error>> => {
  return axios.get(`/courses/${slug}`);
};

//* LESSONS
export const addLessonToCourse = async (slug: string, data: Record<string, unknown>) => {
  return axios.post(`/courses/${slug}/lessons`, data);
};

export const deleteLessonFromCourse = async ({
  slug,
  lessonId,
}: {
  slug: string;
  lessonId: string;
}) => {
  return axios.delete(`/courses/${slug}/lessons/${lessonId}`);
};
