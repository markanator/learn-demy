import { ProtectedInstructorPage } from '../../../components/ProtectedPages/InstructorRoutes';
import React, { useState } from 'react';
import CourseCreateForm from '../../../components/Instructors/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import { uploadImageToS3 } from '../../../async/api/courses';

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
  const [imgPreview, setImgPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Image Upload');

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (event) => {
    setValues({ ...values, loading: true });
    const file = event.target.files[0];
    setImgPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);

    // resize
    Resizer.imageFileResizer(file, 500, 300, 'JPEG', 100, 0, async (uri) => {
      try {
        const { data } = await uploadImageToS3({ image: uri as string });
        console.log('uplaoed image', data);
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.warn(error?.message);
        toast.error('Image uploaded failed. Please try again');
      } finally {
        setValues({ ...values, loading: false });
      }
    });
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
        />
        <pre>{JSON.stringify(values, null, 4)}</pre>
      </div>
    </ProtectedInstructorPage>
  );
};

export default CreateCorusePage;
