import { useRouter } from 'next/router';
import React from 'react';
import { useCourseBySlug } from '../../../../async/rq/courses';
import CourseCreateForm from '../../../../components/Instructors/CourseCreateForm';
import { ProtectedInstructorPage } from '../../../../components/ProtectedPages/InstructorRoutes';

const EditCourse = () => {
  const router = useRouter();
  const { courseSlug } = router.query;

  const { data: course, isLoading, error } = useCourseBySlug(courseSlug as string);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <ProtectedInstructorPage>
      <h1 className="jumbotron text-center bg-primary square py-4 text-capitalize">
        Edit: {course?.name}
      </h1>
      <div className="py-3">
        <CourseCreateForm course={course} isEditing={true} />
      </div>
    </ProtectedInstructorPage>
  );
};

export default EditCourse;
