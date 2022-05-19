import { HolderOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { SlimCourse } from '../CourseCreateForm';
import { Draggable } from 'react-beautiful-dnd';
import { Lesson } from '../../../types';

type LessonItemsListingsProps = {
  lessons: SlimCourse['lessons'];
  handleDelete: (lessonId: string) => () => void;
  openEditLessonModal: (lesson: Lesson) => () => void;
};

export default class LessonItemsListings extends React.PureComponent<LessonItemsListingsProps> {
  render() {
    const { lessons, handleDelete, openEditLessonModal } = this.props;
    return lessons.map((lesson, index) => (
      <ListGroup.Item key={lesson._id} className={classNames('bg-light border-0')}>
        <LessonItem
          index={index}
          handleDelete={handleDelete}
          lesson={lesson}
          openEditLessonModal={openEditLessonModal}
        />
      </ListGroup.Item>
    ));
  }
}

type LessonItemProps = {
  lesson: Lesson;
  index: number;
  handleDelete: (lessonId: string) => () => void;
  openEditLessonModal: (lesson: Lesson) => () => void;
};
const LessonItem = ({ handleDelete, lesson, index, openEditLessonModal }: LessonItemProps) => {
  return (
    <Draggable key={lesson._id} draggableId={lesson._id} index={index}>
      {(draggableProvided) => (
        <>
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
                <div className="d-flex">
                  <h6 className="text-capitalize m-0 me-4 ps-4">{lesson.title}</h6>
                  <EditOutlined onClick={openEditLessonModal(lesson)} />
                </div>
              </div>
              <DeleteOutlined onClick={handleDelete(lesson._id)} className="text-danger" />
            </Col>
          </Row>
        </>
      )}
    </Draggable>
  );
};
