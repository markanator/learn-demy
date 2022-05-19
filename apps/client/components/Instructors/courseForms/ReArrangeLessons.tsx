import { DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import { deleteLessonFromCourse } from '../../../async/api/courses';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { SlimCourse } from '../CourseCreateForm';
import { useRouter } from 'next/router';

type Props = {
  setValues: React.Dispatch<React.SetStateAction<SlimCourse>>;
  values: SlimCourse;
  afterChange: (e?: any) => Promise<void>;
};

const RearrangeLessons = ({ setValues, values, afterChange }: Props) => {
  const router = useRouter();
  const { courseSlug } = router.query;
  const handleOnDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) {
      return;
    }
    const sourceLesson = values.lessons[source.index];
    const newLessonsArray = Array.from(values.lessons);
    newLessonsArray.splice(source.index, 1);
    newLessonsArray.splice(destination.index, 0, sourceLesson);
    const updatedCourse = { ...values, lessons: newLessonsArray };
    console.log('something change?', isEqual(updatedCourse.lessons, newLessonsArray));
    setValues(updatedCourse);
    afterChange();
  };

  const handleDelete = (lessonId: string) => async () => {
    const prevLessons = Array.from(values?.lessons) || [];
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        console.log(' delete ', lessonId);
        const allLessons = values?.lessons?.filter(({ _id }) => _id !== lessonId);
        setValues({ ...values, lessons: allLessons });

        const { data } = await deleteLessonFromCourse(courseSlug as string, lessonId);
        console.log('removed lessons response', data);
      } catch (error) {
        setValues({ ...values, lessons: prevLessons });
        console.warn(error?.message);
      }
    } else {
      return;
    }
  };
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
                  {values?.lessons.map((lesson, index) => (
                    <ListGroup.Item key={lesson._id} className={classNames('bg-light border-0')}>
                      <Draggable key={lesson._id} draggableId={lesson._id} index={index}>
                        {(draggableProvided) => (
                          <Row
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            className="py-1 bg-light"
                          >
                            <Col className="d-flex justify-content-between align-items-center">
                              <div className="d-flex justify-content-start align-items-center">
                                <div style={{ marginTop: '-5px' }}>
                                  <HolderOutlined {...draggableProvided.dragHandleProps} />
                                </div>
                                <h6 className="text-capitalize m-0 ps-4">{lesson.title}</h6>
                              </div>
                              <DeleteOutlined
                                onClick={handleDelete(lesson._id)}
                                className="text-danger"
                              />
                            </Col>
                          </Row>
                        )}
                      </Draggable>
                    </ListGroup.Item>
                  ))}
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
