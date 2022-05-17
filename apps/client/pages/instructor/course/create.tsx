/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import {
  removeInitialImage,
  uploadImageToS3,
} from '../../../async/api/courses';
import { ProtectedInstructorPage } from '../../../components/ProtectedPages/InstructorRoutes';
import CourseCreateForm from '../../../components/Instructors/CourseCreateForm';
import { IS3Image } from '../../../types';

const CreateCorusePage = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: '',
    loading: false,
    category: '',
  });
  const [image, setImage] = useState<IS3Image>(undefined);
  const [imgPreview, setImgPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState<
    'Image Upload' | string
  >('Image Upload');

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true });
    const file = event.target.files[0];
    setImgPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);

    // resize
    Resizer.imageFileResizer(file, 1280, 720, 'JPEG', 100, 0, async (uri) => {
      try {
        const { data } = await uploadImageToS3({ image: uri as string });
        console.log('uplaoed image', data);
        setImage(data as IS3Image);
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.warn(error?.message);
        toast.error('Image uploaded failed. Please try again');
      } finally {
        setValues({ ...values, loading: false });
      }
    });
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });

    try {
      console.log(' HANDLE IMAGE REMOVE');
      const { data } = await removeInitialImage(image);
      console.log('', data);
      setImgPreview('');
      setImage(undefined);
      setUploadButtonText('Image Upload');
    } catch (error) {
      console.warn(error?.message);
      toast.error('Image uploaded failed. Please try again');
    } finally {
      setValues({ ...values, loading: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
  };

  return (
    <ProtectedInstructorPage>
      <h1 className="jumbotron text-center bg-primary square py-4">
        Create Course Page
      </h1>
      <div className="py-3">
        <CourseCreateForm
          values={values}
          handleChange={handleChange}
          handleImage={handleImage}
          handleSubmit={handleSubmit}
          imgPreview={imgPreview}
          uploadButtonText={uploadButtonText}
          handleRemove={handleRemove}
        />
        <pre>{JSON.stringify(values, null, 4)}</pre>
        {image && <img src={image.Location} alt="uploaded image" />}
      </div>
    </ProtectedInstructorPage>
  );
};

export default CreateCorusePage;
