import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import { getPublishedCourses } from '../async/api/courses';
import { Course } from '../types';
import formatMoney from '../utils/formatMoney';

interface Props {
  courses?: Course[];
  error?: Error;
}
const Home: React.FunctionComponent<Props> = ({ courses, error }) => {
  return (
    <div>
      <h1>Hello world</h1>
      <Container>
        <Row className="flex-wrap">
          <>
            {courses &&
              courses.map((course) => (
                <Col key={course._id}>
                  <Card className="my-4">
                    <Link href={'/course/' + course.slug} passHref>
                      <a>
                        <Card.Img
                          variant="top"
                          style={{ objectFit: 'cover' }}
                          src={course?.image?.Location ?? '/img/default-course-image.png'}
                          height="300"
                          width="auto"
                        />
                      </a>
                    </Link>
                    <Card.Body>
                      <Link href={'/course/' + course.slug} passHref>
                        <a>
                          <Card.Title className="text-capitalize">{course.name}</Card.Title>
                        </a>
                      </Link>
                      {/* eslint-disable-next-line */}
                      {/* @ts-ignore */}
                      <Card.Subtitle className="">By: {course.instructor?.name}</Card.Subtitle>
                      <div className="d-flex flex-row mt-2">
                        {course?.category ? (
                          course.category.split(',').map((category) => (
                            <Badge key={category} pill bg="warning" text="dark" className="me-1 text-capitalize">
                              {category}
                            </Badge>
                          ))
                        ) : (
                          <Badge pill bg="warning" text="dark" className="text-capitalize">
                            Uncategorized
                          </Badge>
                        )}
                      </div>
                      <h4 className="mt-2">{course?.paid ? formatMoney(course?.price) : 'Free'}</h4>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </>
        </Row>
      </Container>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { data: courses } = await getPublishedCourses();
    return {
      props: {
        courses,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        courses: [],
        error,
      },
    };
  }
};

export default Home;
