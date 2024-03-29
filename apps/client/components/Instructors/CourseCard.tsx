import { Course } from '../../types';
import Link from 'next/link';
import React from 'react';
import { Card, Row, Col, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

type Props = {
  course: Course;
};
const CourseCard = ({ course }: Props) => {
  return (
    <Card key={course._id} className="overflow-hidden mt-4">
      <Row className="">
        <Col md={3} className="">
          <Link href={`/instructor/course/${course.slug}`} passHref>
            <a>
              <Card.Img
                className="p-0 m-0"
                src={course?.image?.Location || '/img/default-course-image.png'}
                alt={course.name}
                style={{
                  objectFit: 'cover',
                  borderTopRightRadius: '0px',
                  borderBottomRightRadius: '0px',
                }}
                width="325px"
                height="100%"
              />
            </a>
          </Link>
        </Col>
        <Col md={8} className="">
          <div className="py-2">
            <Link href={`/instructor/course/${course.slug}`} passHref>
              <a>
                <Card.Title className="text-capitalize">{course.name}</Card.Title>
              </a>
            </Link>
            <Card.Subtitle>{course?.lessons?.length} Lessons</Card.Subtitle>
            <Card.Text>{course?.description?.slice(0, 144) + '...' || ''}</Card.Text>
            <br />
            {course?.lessons && (
              <>
                {course?.lessons.length < 5 ? (
                  <Alert variant="warning">
                    At least <strong>5 lessons</strong> are required to publish a course.
                  </Alert>
                ) : course.published ? (
                  <Alert variant="success">
                    Course is <strong>live</strong> and available for students to enroll.
                  </Alert>
                ) : (
                  <Alert variant="success">
                    Course is <strong>ready</strong> to be published.
                  </Alert>
                )}
              </>
            )}
          </div>
        </Col>
        <Col md={1} className="d-flex flex-column justify-content-center align-items-center ps-0 fs-2">
          {course.published ? (
            <OverlayTrigger placement="left" overlay={<Tooltip id={'publish-tooltip'}>Successfully published</Tooltip>}>
              <span className="text-success">
                <AiOutlineCheckCircle />
              </span>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip id={'not-publish-tooltip'}>Course not published</Tooltip>}
            >
              <span className="text-danger">
                <AiOutlineCloseCircle />
              </span>
            </OverlayTrigger>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default CourseCard;
