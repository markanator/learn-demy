import React from 'react';
import CourseCreateForm from '../../../components/Instructors/CourseCreateForm';
import { ProtectedInstructorPage } from '../../../components/ProtectedPages/InstructorRoutes';

const CreateCorusePage = () => {
  return (
    <ProtectedInstructorPage>
      <h1 className="jumbotron text-center bg-primary square py-4">Create Course Page</h1>
      <div className="py-3">
        <CourseCreateForm />
      </div>
    </ProtectedInstructorPage>
  );
};

export default CreateCorusePage;
