import { ProtectedInstructorPage } from '../../../components/ProtectedPages/InstructorRoutes';
import React, { useState } from 'react';
import CourseCreateForm from '../../../components/Instructors/CourseCreateForm';

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

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (event) => {
    setImgPreview(window.URL.createObjectURL(event.target.files[0]));
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
        />
        <pre>{JSON.stringify(values, null, 4)}</pre>
      </div>
    </ProtectedInstructorPage>
  );
};

export default CreateCorusePage;
