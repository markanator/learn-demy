import { partial } from 'lodash';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type Props = {
  openLessonModal: boolean;
  setOpenLessonModal: (open: boolean) => void;
};

const initialNewLessonState = {
  title: '',
  content: '',
  video: {},
};

const AddLessonForm = ({ openLessonModal, setOpenLessonModal }: Props) => {
  const [newLessonValues, setNewLessonValues] = useState(initialNewLessonState);
  const handleClouseOut = () => {
    setOpenLessonModal(false);
  };

  const handleAddLesson = (e) => {
    // submit to backend
    e.preventDefault();
    console.log('submit newLessonValues', newLessonValues);
    handleClouseOut();
  };
  return (
    <Modal centered backdrop="static" show={openLessonModal} onHide={handleClouseOut}>
      <Modal.Header closeButton>
        <Modal.Title>Add Lesson</Modal.Title>
      </Modal.Header>
      <Modal.Body as="form" onSubmit={handleAddLesson}>
        <Form.Group className="mb-3" controlId="lessonName">
          <Form.Label>Lesson Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introduction to..."
            value={newLessonValues.title}
            onChange={(e) => setNewLessonValues({ ...newLessonValues, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="content">
          <Form.Label>Lesson content</Form.Label>
          <textarea
            className="form-control"
            id="content"
            rows={3}
            value={newLessonValues.content}
            onChange={(e) => setNewLessonValues({ ...newLessonValues, content: e.target.value })}
          ></textarea>
        </Form.Group>

        <Button type="submit" className="w-100 mt-3">
          Submit
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AddLessonForm;
