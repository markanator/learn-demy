import { DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { isEqual, throttle } from 'lodash';
import { useRouter } from 'next/router';
import React, { PureComponent } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { deleteLessonFromCourse } from '../../../async/api/courses';
import { SlimCourse } from '../CourseCreateForm';

type Props = {
  setValues: React.Dispatch<React.SetStateAction<SlimCourse>>;
  values: SlimCourse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    throttle(afterChange, 500);
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
                  <LessonItemsListings handleDelete={handleDelete} lessons={values?.lessons} />
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

type LessonItemsListingsProps = {
  lessons: SlimCourse['lessons'];
  handleDelete: (lessonId: string) => () => void;
};

class LessonItemsListings extends PureComponent<LessonItemsListingsProps> {
  render() {
    const { lessons, handleDelete } = this.props;
    return lessons.map((lesson, index) => (
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
                <DeleteOutlined onClick={handleDelete(lesson._id)} className="text-danger" />
              </Col>
            </Row>
          )}
        </Draggable>
      </ListGroup.Item>
    ));
  }
}
export default RearrangeLessons;
