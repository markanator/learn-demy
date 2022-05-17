import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { partial } from 'lodash';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { ProtectedInstructorPage } from '../../../../components/ProtectedPages/InstructorRoutes';
import { useCourseBySlug } from '../../../../async/rq/courses';
import AddLessonForm from '../../../../components/Instructors/courseForms/AddLessonForm';

const ViewCourseById = () => {
  const router = useRouter();
  const { courseSlug } = router.query;
  const [openLessonModal, setOpenLessonModal] = useState(false);

  const { data: course, isLoading, error } = useCourseBySlug(courseSlug as string);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return (
    <ProtectedInstructorPage>
      {course && (
        <Container fluid className="">
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
                <Col
                  md={1}
                  className="py-2 d-flex flex-column justify-content-start align-items-center"
                >
                  <Button className="mb-2 w-100">Edit</Button>
                  <Button className="mb-0 w-100">Publish</Button>
                </Col>
              </Row>
            </Card>
          </Row>
          <Row className="mt-4">
            <Col md={12} className="card py-2" style={{ maxHeight: '350px', overflowY: 'scroll' }}>
              <Card.Subtitle className="text-capitalize text-secondary mb-2">
                Description
              </Card.Subtitle>
              <ReactMarkdown>{course?.description}</ReactMarkdown>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Button onClick={partial(setOpenLessonModal, true)}>Add Lesson</Button>
              <AddLessonForm
                openLessonModal={openLessonModal}
                setOpenLessonModal={setOpenLessonModal}
              />
            </Col>
          </Row>
        </Container>
      )}
    </ProtectedInstructorPage>
  );
};

export default ViewCourseById;
