import Link from 'next/link';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { Course } from '../types';

type Props = {
  course: Course;
};

const SimpleCourseCard = ({ course }: Props) => {
  const link = `/course/${course.slug}/learn`;
  return (
    <Card key={course._id} className="overflow-hidden mt-4">
      <Row className="">
        <Col md={3} className="">
          <Link href={link} passHref>
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
                height="100"
              />
            </a>
          </Link>
        </Col>
        <Col md={8} className="">
          <div className="py-2">
            <Link href={link} passHref>
              <a>
                <Card.Title className="text-capitalize">{course.name}</Card.Title>
              </a>
            </Link>
            <Card.Subtitle className="text-capitalize">By: {course?.instructor?.name}</Card.Subtitle>
          </div>
        </Col>
        <Col md={1} className="d-flex flex-column justify-content-center align-items-center ps-0 fs-2">
          <Link href={link} passHref>
            <a>
              <AiOutlinePlayCircle className="text-primary" />
            </a>
          </Link>
        </Col>
      </Row>
    </Card>
  );
};

export default SimpleCourseCard;
