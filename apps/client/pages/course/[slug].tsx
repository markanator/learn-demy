/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import React, { useState } from 'react';
import { Badge, Breadcrumb, Button, Col, Container, Image, ListGroup, Row, Tab, Tabs } from 'react-bootstrap';
import { getPublishedCourse } from '../../async/api/courses';
import { Course } from '../../types';
import formatMoney from '../../utils/formatMoney';
import { AiFillPlayCircle } from 'react-icons/ai';
import VideoPreviewModal from '../../components/VideoPreviewModal';

type Props = {
  course?: Course;
  error?: Error;
};

const CourseBySlug = ({ course, error }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState('');
  return (
    <div className="position-relative">
      {/* BREADCRUMBS */}
      <div className="w-100 border-bottom position-relative">
        <div className="position-absolute left-0 top-0 w-100 pt-3 ps-1" style={{ backgroundColor: '#f2f4f5' }}>
          <Container>
            <Row>
              <Col>
                <div>
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <a href="index.html">Home</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <a href="courses.html">Courses</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Course Details</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      {/* COURSE */}
      <div className="w-100 bg-white" style={{ paddingTop: '57px', paddingBottom: '100px' }}>
        <Container>
          <Row>
            <Col lg={8}>
              <div className="w-100">
                <h1 className="mt-4 text-capitalize" style={{ color: '#384158' }}>
                  {course?.name}
                </h1>
                <div
                  className="w-100 d-flex flex-column flex-lg-row  align-items-lg-center align-items-start justify-content-start"
                  style={{ height: '92px', marginTop: '55px', backgroundColor: '#f2f4f5' }}
                >
                  {/* COURSE Instrctor */}
                  <div
                    className="d-flex flex-column justify-content-start align-items-start"
                    style={{ width: '33.333%', paddingLeft: '30px' }}
                  >
                    <h4 style={{ fontSize: '18px', color: '#384158' }}>Instructor:</h4>
                    <div className="mt-2">
                      <span>{course?.instructor?.name}</span>
                    </div>
                  </div>

                  {/* COURSE INFO: REVIEWS */}
                  <div
                    className="d-flex flex-column justify-content-start align-items-start"
                    style={{ width: '33.333%', paddingLeft: '30px' }}
                  >
                    <h4 style={{ fontSize: '18px', color: '#384158' }}>Reviews:</h4>
                    <div className="mt-2 rating_r_4">4 Stars</div>
                  </div>

                  {/* CATEGORY */}
                  <div
                    className="d-flex flex-column justify-content-start align-items-start"
                    style={{ width: '33.333%', paddingLeft: '30px' }}
                  >
                    <h4 style={{ fontSize: '18px', color: '#384158' }}>Categories:</h4>
                    <Row>
                      {course?.category ? (
                        course.category.split(',').map((category) => (
                          <Col key={category}>
                            <Badge pill bg="warning" text="dark" className="me-1 text-capitalize">
                              {category}
                            </Badge>
                          </Col>
                        ))
                      ) : (
                        <Col>
                          <Badge pill bg="warning" text="dark" className="text-capitalize">
                            Uncategorized
                          </Badge>
                        </Col>
                      )}
                    </Row>
                  </div>
                </div>

                {/* <!-- Course Image or preview --> */}
                <div className="mt-4 w-100">
                  {course?.lessons[0]?.video?.Location ? (
                    <div
                      style={{
                        backgroundImage: 'url(' + course?.image.Location + ')',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        marginBottom: '25px',
                        width: '856px',
                        height: '406px',
                      }}
                      className="d-flex justify-content-center align-items-center"
                      onClick={() => {
                        setPreview(course?.lessons[0].video.Location);
                        setShowModal(!showModal);
                      }}
                    >
                      <AiFillPlayCircle className="fs-1 text-light" />
                    </div>
                  ) : (
                    <Image
                      className="w-100 object-cover"
                      src={course?.image?.Location ?? '/img/default-course-image.png'}
                      alt={course?.name}
                      width={856}
                      height={406}
                    />
                  )}
                </div>

                {/* <!-- Course Tabs --> */}
                <Tabs className="w-100 mt-4" defaultActiveKey="Description">
                  {/* <!-- Description --> */}
                  <Tab eventKey="Description" title="Description" className="p-3">
                    <h5 className="text-capitalize">{course?.name}</h5>
                    <ReactMarkdown>{course?.description}</ReactMarkdown>
                  </Tab>

                  {/* <!-- Curriculum --> */}
                  <Tab eventKey="Curriculum" title="Curriculum" className="p-3">
                    <div className="tab_panel_content">
                      <h5 className="text-capitalize">{course?.name}</h5>
                      <div>
                        <ListGroup className="mt-4">
                          {course?.lessons.map((lesson) => (
                            <ListGroup.Item
                              key={lesson._id}
                              className="d-flex justify-content-between align-items-center"
                            >
                              <div className="ms-2 py-2 me-auto">
                                <div className="fw-bold text-capitalize">{lesson?.title}</div>
                              </div>
                              {lesson?.free_preview && (
                                <Badge bg="primary" pill>
                                  Free Preview
                                </Badge>
                              )}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </Col>

            {/* <!-- Course Sidebar --> */}
            <Col lg={4}>
              <div className="w-100" style={{ paddingLeft: '40px', paddingTop: '120px' }}>
                {/* <!-- Feature --> */}
                <div className="mb-4">
                  <h4 style={{ color: '#384158' }}>Course Features</h4>
                  <div className="mt-4">
                    <h3 style={{ color: '#14bdee' }}>{course?.paid ? formatMoney(course.price) : 'Free'}</h3>

                    <div className="feature_list">
                      {/* <!-- ENROLL --> */}
                      <div className="feature d-flex flex-row align-items-center justify-content-start">
                        <Button className="mt-2">Add To Cart</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Feature --> */}
                <div className="mb-2">
                  <h4 style={{ color: '#384158' }}>Instructor</h4>
                  <div className="mt-1">
                    <div className="teacher_title_container d-flex flex-row align-items-center justify-content-start">
                      <div className="mt-2">
                        <img
                          src={course?.instructor?.picture || '/img/default_user_avatar.jpg'}
                          alt={course?.instructor?.name}
                          width={80}
                          height={80}
                        />
                      </div>
                      <div className="ps-4">
                        <div className="teacher_name">
                          {/* <Link href="#" passHref> */}
                          {/* <a> */}
                          <h5>{course?.instructor?.name}</h5>
                          {/* </a> */}
                          {/* </Link> */}
                        </div>
                        {/* <div className="teacher_position">Marketing & Management</div> */}
                      </div>
                    </div>
                    {course?.instructor?.bio && (
                      <div className="mt-4">
                        <p>{course?.instructor?.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <>
        <VideoPreviewModal preview={preview} setShowModal={setShowModal} showModal={showModal} />
      </>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { slug } = query;
    console.log({ slug });
    const { data: course } = await getPublishedCourse(slug as string);
    return {
      props: {
        course,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        course: null,
        error,
      },
    };
  }
};

export default CourseBySlug;
