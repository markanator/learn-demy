import { ProtectedInstructorPage } from '../../components/ProtectedPages/InstructorRoutes';
import React from 'react';

// type Props = {};

const InstructorHomePage = () => {
  return (
    <ProtectedInstructorPage>
      <h1>Instructor Home Page</h1>
    </ProtectedInstructorPage>
  );
};

export default InstructorHomePage;
