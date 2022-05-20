import type { Lesson } from '../../../types';
import { throttle } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { SlimCourse } from '../CourseCreateForm';
import LessonItemsListings from './LessonItemsListings';
import { useDeleteLessonFromCourseMutation } from '../../../async/rq/courses';

type Props = {
  setValues: React.Dispatch<React.SetStateAction<SlimCourse>>;
  values: SlimCourse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterChange: (e?: any) => Promise<void>;
  openEditLessonModal: (lesson: Lesson) => () => void;
};

const RearrangeLessons = ({ setValues, values, afterChange, openEditLessonModal }: Props) => {
  const router = useRouter();
  const { courseSlug } = router.query;

  const { mutateAsync: deleteLessonFromCourse } = useDeleteLessonFromCourseMutation();

  const handleOnDragEnd = useCallback(
    (result) => {
      const { destination, source } = result;
      if (!destination || destination.index === source.index) {
        return;
      }
      const sourceLesson = values.lessons[source.index];
      const newLessonsArray = Array.from(values.lessons);
      newLessonsArray.splice(source.index, 1);
      newLessonsArray.splice(destination.index, 0, sourceLesson);
      const updatedCourse = { ...values, lessons: newLessonsArray };
      // TODO: this is a hack to make sure the course is updated
      setValues(updatedCourse);
      throttle(afterChange, 500);
    },
    [values, setValues, afterChange]
  );

  const handleDelete = useCallback(
    (lessonId: string) => async () => {
      const prevLessons = Array.from(values?.lessons) || [];
      if (window.confirm('Are you sure you want to delete this lesson?')) {
        try {
          const allLessons = values?.lessons?.filter(({ _id }) => _id !== lessonId);
          setValues({ ...values, lessons: allLessons });

          await deleteLessonFromCourse({ courseSlug: courseSlug as string, lessonId });
        } catch (error) {
          setValues({ ...values, lessons: prevLessons });
          console.warn(error?.message);
        }
      } else {
        return;
      }
    },
    [values, setValues, courseSlug, deleteLessonFromCourse]
  );

  return (
    <Row className="mt-4">
      <Col>
        <h4>{values?.lessons?.length} Lessons</h4>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <>
            <Droppable droppableId="lessons">
              {(droppableProvided) => (
                <ListGroup
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                  className="bg-light border-0 h-100"
                  style={{ paddingBottom: '70px', minHeight: '200px' }}
                >
                  <LessonItemsListings
                    handleDelete={handleDelete}
                    openEditLessonModal={openEditLessonModal}
                    lessons={values?.lessons}
                  />
                  {droppableProvided.placeholder}
                </ListGroup>
              )}
            </Droppable>
          </>
        </DragDropContext>
      </Col>
    </Row>
  );
};

export default RearrangeLessons;
