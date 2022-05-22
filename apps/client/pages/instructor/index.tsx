import React from 'react';
import { useInstructorAuthoredCourses } from '../../async/rq/instructors';
import CourseCard from '../../components/Instructors/CourseCard';
import { ProtectedInstructorPage } from '../../components/ProtectedPages/InstructorRoutes';
import { Course } from '../../types';

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
        {data.map((course: Course) => (
          <CourseCard course={course} key={course?._id} />
        ))}
      </ul>
    </ProtectedInstructorPage>
  );
};

export default InstructorHomePage;
