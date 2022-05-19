import { Lesson } from '../../../types';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  currentLessonToEdit: Lesson;
};

const UpdateLessonModal = ({ isOpen, handleClose, currentLessonToEdit }: Props) => {
  const [uploadButtonText, setUploadButtonText] = React.useState<string>('Upload Video');
  const [proress, setProress] = React.useState<number>(-1);
  const [isWorking, setIsWorking] = React.useState<boolean>(false);

  const handleUpdateLesson = () => {
    console.log(' handle upload');
  };
  const handleUploadVideo = () => {
    console.log(' handle upload Video');
  };
  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre>{JSON.stringify(currentLessonToEdit, null, 2)}</pre>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateLessonModal;
