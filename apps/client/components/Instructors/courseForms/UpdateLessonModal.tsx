import { Lesson } from '../../../types';
import React from 'react';
import { Badge, Button, Col, Form, Modal, ProgressBar, Row } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { useRemoveVideoFromS3, useUpdateLesson, useUploadVideoToS3 } from '../../../async/rq/lessons';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  currentLessonToEdit: Lesson;
  setCurrentLessonToEdit: React.Dispatch<React.SetStateAction<Lesson>>;
};

const UpdateLessonModal = ({ isOpen, handleClose, currentLessonToEdit, setCurrentLessonToEdit }: Props) => {
  const router = useRouter();
  const { courseSlug } = router.query;
  const [uploadButtonText, setUploadButtonText] = React.useState<string>('Upload Video');
  const [progress, setProgress] = React.useState<number>(-1);
  const [isWorking, setIsWorking] = React.useState<boolean>(false);

  const { mutateAsync: uploadVideoToS3 } = useUploadVideoToS3();
  const { mutateAsync: removeVideoFromS3 } = useRemoveVideoFromS3();
  const { mutateAsync: updateLesson } = useUpdateLesson();

  const handleUpdateLesson = async (event) => {
    event.preventDefault();
    try {
      setIsWorking(true);
      await updateLesson({
        courseSlug: courseSlug as string,
        lessonId: currentLessonToEdit?._id,
        data: currentLessonToEdit,
      });

      toast.success('Lesson updated successfully');
    } catch (error) {
      console.warn(error?.message);
      toast.error('Lesson update failed');
    } finally {
      setUploadButtonText('Upload Video');
      setIsWorking(false);
    }
  };

  const handleUploadVideo = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      setIsWorking(true);
      if (currentLessonToEdit?.video?.Location) {
        await removeVideoFromS3(currentLessonToEdit.video);
      }

      setUploadButtonText(file.name);

      const data = new FormData();
      data.append('file', file);
      data.append('course_id', currentLessonToEdit._id);

      const { data: video } = await uploadVideoToS3({
        data,
        config: {
          onUploadProgress: ({ loaded, total }) => {
            setProgress(Math.round((100 * loaded) / total));
          },
        },
      });

      setCurrentLessonToEdit({ ...currentLessonToEdit, video });
      toast.success('Video uploaded successfully');
    } catch (error) {
      console.warn(error);
      toast.error('Video upload failed');
    } finally {
      setProgress(-1);
      setUploadButtonText('Upload Video');
      setIsWorking(false);
    }
  };

  const handleChange = (e) => {
    setCurrentLessonToEdit({ ...currentLessonToEdit, [e.target.name]: e.target.value });
  };

  const handleSwitch = (e) => {
    setCurrentLessonToEdit({ ...currentLessonToEdit, [e.target.name]: e.target.checked });
  };

  return (
    <Modal show={isOpen} onHide={handleClose} s>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col as="form" onSubmit={handleUpdateLesson}>
            <Form.Group className="mb-3">
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Title"
                value={currentLessonToEdit?.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <textarea
                name="content"
                placeholder="Description"
                cols={7}
                rows={7}
                value={currentLessonToEdit?.content}
                className="form-control"
                onChange={handleChange}
              ></textarea>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="btn btn-outline-secondary btn-block text-left">
                    <span>{uploadButtonText}</span>
                    <Form.Control
                      type="file"
                      name="video"
                      className="w-100"
                      onChange={handleUploadVideo}
                      accept="video/*"
                      hidden
                    />
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col>
                {progress > -1 && <ProgressBar className="d-flex justify-content-center" now={progress} />}
                {!isWorking && currentLessonToEdit?.video && currentLessonToEdit?.video?.Location && (
                  <div className="d-flex justify-content-center">
                    <ReactPlayer url={currentLessonToEdit?.video?.Location} controls width="410px" height="240px" />
                  </div>
                )}
              </Col>
            </Row>

            <Row className="mb-3">
              <div className="d-flex justify-content-between">
                <Badge className="">Free Previewable</Badge>
                <Form.Check
                  type="switch"
                  name="free_preview"
                  // eslint-disable-next-line
                  // @ts-ignore
                  value={String(currentLessonToEdit?.free_preview)}
                  onChange={handleSwitch}
                  size={12}
                  aria-label="Toggle is free previewable"
                />
              </div>
            </Row>
            <Row>
              <Col>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={isWorking}>
                  Save
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateLessonModal;
