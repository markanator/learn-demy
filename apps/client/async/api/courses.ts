import { IS3Image } from '../../types';
import axios from '../axios';

export const uploadImageToS3 = async (data: { image: string }) => {
  return axios.post('/courses/upload-image', data);
};

export const removeInitialImage = async (data: IS3Image) => {
  return axios.post('/courses/remove-image', data);
};
