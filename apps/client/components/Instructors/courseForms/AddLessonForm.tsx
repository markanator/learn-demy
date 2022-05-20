import { useAddLessonToCourse, useRemoveVideoFromS3, useUploadVideoToS3 } from '../../../async/rq/lessons';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { Button, Form, Modal, OverlayTrigger, ProgressBar, Tooltip } from 'react-bootstrap';
import { AiFillCloseCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { IS3Image } from '../../../types';

type Props = {
  openLessonModal: boolean;
  setOpenLessonModal: (open: boolean) => void;
};

interface OinitialNewLessonState {
  title: string;
  content: string;
  video?: IS3Image;
}
const initialNewLessonState: OinitialNewLessonState = {
  title: '',
  content: '',
  video: null,
};

const renderTooltip = (props) => (
  <Tooltip id="remove-video" {...props}>
    Remove Video
  </Tooltip>
);

const AddLessonForm = ({ openLessonModal, setOpenLessonModal }: Props) => {
  const router = useRouter();
  const { courseSlug } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [newLessonValues, setNewLessonValues] = useState(initialNewLessonState);
  const [uploadVideoText, setUploadVideoText] = useState<'Upload Video' | string>('Upload Video');
  const [videoUploadProgress, setVideoUploadProgress] = useState(-1);

  const { mutateAsync: addLessonToCourse } = useAddLessonToCourse();
  const { mutateAsync: uploadVideoToS3 } = useUploadVideoToS3();
  const { mutateAsync: removeVideoFromS3 } = useRemoveVideoFromS3();

  const handleClouseOut = () => {
    setOpenLessonModal(false);
    setIsLoading(false);
    setNewLessonValues(initialNewLessonState);
    setUploadVideoText('Upload Video');
    setVideoUploadProgress(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLessonValues({ ...newLessonValues, [name]: value });
  };

  const onUploadProgress = useCallback(({ loaded, total }) => {
    // eslint-disable-next-line prefer-const
    let percent = Math.round((100 * loaded) / total);
    setVideoUploadProgress(percent);
  }, []);

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const file = e.target.files[0];
      if (file) {
        setUploadVideoText(file.name);

        const videoFormData = new FormData();
        videoFormData.append('video', file);
        // save progress bar
        const { data } = await uploadVideoToS3({ data: videoFormData, config: { onUploadProgress } });
        // successful response
        setNewLessonValues({ ...newLessonValues, video: data });
        setVideoUploadProgress(-1);
        toast.success('Video uploaded successfully');
      }
    } catch (error) {
      toast.error('Video upload failed. Please try again');
      console.warn(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoRemove = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await removeVideoFromS3(newLessonValues.video);
      setNewLessonValues({ ...newLessonValues, video: null });
      setUploadVideoText('Upload Video');
      toast.success('Video removed successfully');
      setVideoUploadProgress(-1);
    } catch (error) {
      toast.error('Video could not be removed. Please try again later');
      console.warn(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addLessonToCourse({ slug: courseSlug as string, data: newLessonValues });
      console.info('success', data);
      handleClouseOut();
      toast.success('Lesson added successfully');
    } catch (error) {
      console.error(error?.message);
      toast.error('Lesson could not be added. Please try again later');
    }
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
              <ProgressBar className="mb-2" style={{ height: '10px' }} animated now={videoUploadProgress} />
            )}
            <div className="d-flex flex-row">
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

              {!isLoading && newLessonValues.video?.Location && (
                <>
                  <OverlayTrigger overlay={renderTooltip}>
                    <span onClick={handleVideoRemove} className="pt-1 ms-4">
                      <AiFillCloseCircle className="fs-2 text-danger" />
                    </span>
                  </OverlayTrigger>
                </>
              )}
            </div>
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
