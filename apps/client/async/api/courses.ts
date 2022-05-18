import { AxiosRequestConfig } from 'axios';
import { IS3Image } from '../../types';
import axios from '../axios';

export const uploadImageToS3 = async (data: { image: string }) => {
  return axios.post('/courses/upload-image', data);
};

export const removeInitialImage = async (data: IS3Image) => {
  return axios.post('/courses/remove-image', data);
};

export const createCourse = async (data: Record<string, unknown>) => {
  return axios.post('/courses', data);
};

export const getCourseBySlug = async (slug: string) => {
  return axios.get(`/courses/${slug}`);
};

export const uploadVideoToS3 = async (data: FormData, config: AxiosRequestConfig<FormData>) => {
  return axios.post(`/courses/upload-video`, data, config);
};

export const removeVideoFromS3 = async (data: IS3Image) => {
  return axios.post('/courses/remove-video', data);
};


export const addLessonToCourse = async (slug: string, data: Record<string, unknown>) => {
  return axios.post(`/courses/${slug}/lessons`, data);
};
