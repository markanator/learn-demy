import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { partial } from 'lodash';
import { Button, Card, Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { ProtectedInstructorPage } from '../../../../components/ProtectedPages/InstructorRoutes';
import { useCourseBySlug, useToggleCoursePublishedMutation } from '../../../../async/rq/courses';
import AddLessonForm from '../../../../components/Instructors/courseForms/AddLessonForm';
import Link from 'next/link';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineQuestionCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';

const ViewCourseToEdit = (props) => {
  const router = useRouter();
  const { courseSlug } = router.query;
  const [openLessonModal, setOpenLessonModal] = useState(false);

  const { data: course, isLoading, error } = useCourseBySlug(courseSlug as string);
  const { mutateAsync: toggleCoursePublish } = useToggleCoursePublishedMutation();

  const handlePublish = async (e) => {
    if (window?.confirm('Once you publish your course, it will be live on the marketplace.')) {
      try {
        const { data } = await toggleCoursePublish({ courseId: course?._id, value: true });
        console.log('publish course', data);
        toast.success('Course published successfully.');
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong. Please try again later.');
      }
    }
  };
  const handleUnPublish = async (e) => {
    if (window?.confirm('Once you unpublish your course, it will not be available for your users to enjoy.')) {
      try {
        const { data } = await toggleCoursePublish({ courseId: course?._id, value: false });
        console.log('UNpublish course', data);
        toast.success('Course unpublished successfully.');
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong. Please try again later.');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return (
    <ProtectedInstructorPage>
      {course && (
        <Container fluid className="">
          {/* TOP ROW */}
          <Row>
            <Card key={course._id} className="overflow-hidden mt-4 ps-0">
              <Row className="px-0 mx-0 w-100">
                <Col md={3} className="px-0">
                  <Card.Img
                    className="p-0 m-0"
                    src={course?.image?.Location || 'https://picsum.photos/300/300?image=1072'}
                    alt={course.name}
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderTopRightRadius: '0px',
                      borderBottomRightRadius: '0px',
                    }}
                    width="100%"
                    height="100"
                  />
                </Col>
                <Col md={8} className="d-flex flex-column justify-content-center">
                  <Card.Title className="text-capitalize">{course.name}</Card.Title>
                </Col>
                <Col md={1} className="py-2 px-0 d-flex flex-column justify-content-start align-items-center">
                  <Link href={`${courseSlug}/edit`} passHref>
                    <Button as="a" className="mb-2 w-100">
                      Edit
                    </Button>
                  </Link>

                  {course?.lessons?.length < 5 ? (
                    <OverlayTrigger
                      placement="left"
                      overlay={<Tooltip id={'not-publish-tooltip'}>Min 5 lessons required to published</Tooltip>}
                    >
                      <span className="fs-3 text-dark m-0 p-0">
                        <AiOutlineQuestionCircle />
                      </span>
                    </OverlayTrigger>
                  ) : course?.published ? (
                    <OverlayTrigger
                      placement="left"
                      overlay={<Tooltip id={'unpublish-tooltip'}>Unpublish Course</Tooltip>}
                    >
                      <span className="fs-3 text-danger m-0 p-0">
                        <AiOutlineCloseCircle onClick={handleUnPublish} />
                      </span>
                    </OverlayTrigger>
                  ) : (
                    <OverlayTrigger
                      placement="left"
                      overlay={<Tooltip id={'ready-publish-tooltip'}>Ready to publish</Tooltip>}
                    >
                      <span className="fs-3 text-success m-0 p-0">
                        <AiOutlineCheckCircle onClick={handlePublish} />
                      </span>
                    </OverlayTrigger>
                  )}
                </Col>
              </Row>
            </Card>
          </Row>
          {/* DESCRIPTION */}
          <Row className="mt-4">
            <Col md={12} className="card py-2" style={{ maxHeight: '350px', overflowY: 'scroll' }}>
              <Card.Subtitle className="text-capitalize text-secondary mb-2">Description</Card.Subtitle>
              <ReactMarkdown>{course?.description}</ReactMarkdown>
            </Col>
          </Row>
          {/* LESSONS */}
          <Row className="mt-4">
            <Col>
              <Button onClick={partial(setOpenLessonModal, true)}>Add Lesson</Button>
              <AddLessonForm openLessonModal={openLessonModal} setOpenLessonModal={setOpenLessonModal} />
            </Col>
          </Row>
          <Row className="mt-4 pb-4">
            <Col>
              <h5>{course?.lessons.length} Lessons</h5>
              <ol>
                {course?.lessons.map((lesson) => (
                  <li key={lesson._id}>{lesson.title}</li>
                ))}
              </ol>
            </Col>
          </Row>
        </Container>
      )}
    </ProtectedInstructorPage>
  );
};

export default ViewCourseToEdit;
