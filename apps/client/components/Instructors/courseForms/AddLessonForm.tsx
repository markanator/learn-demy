import { uploadVideoToS3 } from '../../../async/api/courses';
import React, { useCallback, useState } from 'react';
import { Button, Form, Modal, ProgressBar } from 'react-bootstrap';

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
  const [isLoading, setIsLoading] = useState(false);
  const [newLessonValues, setNewLessonValues] = useState(initialNewLessonState);
  const [uploadVideoText, setUploadVideoText] = useState<'Upload Video' | string>('Upload Video');
  const [videoUploadProgress, setVideoUploadProgress] = useState(-1);

  const handleClouseOut = () => {
    setOpenLessonModal(false);
    setVideoUploadProgress(-1);
    setUploadVideoText('Upload Video');
    setNewLessonValues(initialNewLessonState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLessonValues({ ...newLessonValues, [name]: value });
  };

  const onUploadProgress = useCallback(({ loaded, total }) => {
    console.log({ loaded, total });
    // eslint-disable-next-line prefer-const
    let percent = Math.round((100 * loaded) / total);
    setVideoUploadProgress(percent);
    console.log({ percent });
  }, []);

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const file = e.target.files[0];
      if (file) {
        console.log({ file });
        setUploadVideoText(file.name);

        const videoFormData = new FormData();
        videoFormData.append('video', file);
        // save progress bar
        const { data } = await uploadVideoToS3(videoFormData, {
          onUploadProgress,
        });
        // successful response
        console.log('VIDEO DATA', data);
        setNewLessonValues({ ...newLessonValues, video: data });
        // setUploadVideoText('Upload Video');
        setVideoUploadProgress(-1);
      }
    } catch (error) {
      console.warn(error?.message);
    } finally {
      setIsLoading(false);
    }
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
        <fieldset disabled={isLoading}>
          <Form.Group className="mb-3" controlId="lessonName">
            <Form.Label>Lesson Name</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Introduction to..."
              value={newLessonValues.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="content">
            <Form.Label>Lesson content</Form.Label>
            <textarea
              name="content"
              className="form-control"
              rows={3}
              value={newLessonValues.content}
              onChange={handleChange}
            ></textarea>
          </Form.Group>

          <Form.Group>
            {videoUploadProgress > -1 && videoUploadProgress < 100 && (
              <ProgressBar
                className="mb-2"
                style={{ height: '10px' }}
                animated
                now={videoUploadProgress}
              />
            )}
            <Form.Label className=" w-100 btn btn-outline-secondary btn-block text-left">
              <span>{uploadVideoText}</span>
              <Form.Control
                type="file"
                name="video"
                className="w-100"
                onChange={handleVideoChange}
                accept="video/*"
                hidden
              />
            </Form.Label>
          </Form.Group>
        </fieldset>

        <Button type="submit" className="w-100 mt-3" disabled={isLoading || !newLessonValues.title}>
          Submit
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AddLessonForm;
