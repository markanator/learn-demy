import { useAuth } from '../../context/auth.context';
import React from 'react';
import ProtectedUserPage from '../../components/ProtectedPages/UserRotues';
import { useGetUserEnrolledCourses } from '../../async/rq/user';
import SimpleCourseCard from '../../components/SimpleCourseCard';
import { Course } from '../../types';

// type Props = {}

const UserHomePage = (props) => {
  const { state } = useAuth();
  const { data = [], isLoading, error } = useGetUserEnrolledCourses(state?.user?._id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <ProtectedUserPage>
      <h1>USER HOME PAGE</h1>
      <ul>
        {data.map((course: Course) => (
          <SimpleCourseCard course={course} key={course?._id} />
        ))}
      </ul>
    </ProtectedUserPage>
  );
};

export default UserHomePage;
