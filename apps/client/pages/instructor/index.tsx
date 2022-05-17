import { ProtectedInstructorPage } from '../../components/ProtectedPages/InstructorRoutes';
import React from 'react';
import { useInstructorAuthoredCourses } from '../../async/rq/instructors';

// type Props = {};

const InstructorHomePage = () => {
  const { data, isLoading, error } = useInstructorAuthoredCourses();

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error!</div>;
  }

  return (
    <ProtectedInstructorPage>
      <h1>Instructor Home Page</h1>
      <ul>
        {data.map((course) => (
          <li key={course.id}>{course.name}</li>
        ))}
      </ul>
    </ProtectedInstructorPage>
  );
};

export default InstructorHomePage;
