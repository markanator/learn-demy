import { ProtectedInstructorPage } from '../../../components/ProtectedPages/InstructorRoutes';
import React from 'react';

const CreateCorusePage = () => {
  return (
    <ProtectedInstructorPage>
      <h1>Create Course Page</h1>
    </ProtectedInstructorPage>
  );
};

export default CreateCorusePage;
