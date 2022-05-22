import { useEnrolledCourseDetails } from '../../../../async/rq/user';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import ProtectedUserPage from '../../../../components/ProtectedPages/UserRotues';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { partial } from 'lodash';
import { Lesson } from '../../../../types';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import Confetti from 'react-confetti';
import { toast } from 'react-toastify';
import { useWindowSize } from 'react-use';

type Props = {
  //
};

const EnrolledUserLearnPage = (props: Props) => {
  const router = useRouter();
  const { slug } = router.query;

  const [showSidebar, setShowSidebar] = React.useState(true);
  const [lessonToDisplayIndex, setLessonIndexToDisplay] = React.useState(0);
  const [courseCompleted, setCourseCompleted] = React.useState(false);
  const { width, height } = useWindowSize();

  const { data: course, isLoading, error } = useEnrolledCourseDetails(slug as string);

  const lessonInfo: Lesson = useMemo(
    () => course?.lessons[lessonToDisplayIndex] || null,
    [course?.lessons, lessonToDisplayIndex]
  );

  const isLastLesson = useMemo(
    () => lessonToDisplayIndex === course?.lessons.length - 1,
    [lessonToDisplayIndex, course?.lessons]
  );

  const handlePressNextLesson = () => {
    if (lessonToDisplayIndex <= course?.lessons.length) {
      setLessonIndexToDisplay(lessonToDisplayIndex + 1);
    }
  };

  const handleCompleteCourse = () => {
    setCourseCompleted(true);
    toast.success('Course completed!', {
      hideProgressBar: false,
      autoClose: 10000,
      onClose: () => {
        router.push('/user');
      },
    });
  };

  if (isLoading) {
    return (
      <ProtectedUserPage showSidebar={false}>
        <div>Loading...</div>
      </ProtectedUserPage>
    );
  }
  if (error) {
    return (
      <ProtectedUserPage showSidebar={false}>
        {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore */}
        <div>{error?.message}</div>
      </ProtectedUserPage>
    );
  }

  return (
    <ProtectedUserPage showSidebar={false}>
      <Row>
        {courseCompleted && <Confetti width={width} height={height} />}
        {showSidebar && (
          <Col md={2} className="bg-dark text-white p-4" style={{ height: 'max(calc(100vh - 56px), 300px)' }}>
            <div className="w-100 d-flex justify-content-between mb-4">
              <>
                <Link href="/user" passHref>
                  <Button as="a" size="sm" className="btn-light text-start text-nowrap">
                    {'< '} Dashboard
                  </Button>
                </Link>
              </>
              <>
                <Button variant="light" size="sm" onClick={partial(setShowSidebar, false)}>
                  <AiOutlineMenuFold />
                </Button>
              </>
            </div>

            <ul style={{ listStyle: 'none' }} className="m-0 p-0">
              {course?.lessons.map((lesson, idx) => (
                <li key={lesson?._id} className="mb-2">
                  <Button onClick={partial(setLessonIndexToDisplay, idx)} className="btn-dark">
                    {lesson.title.slice(0, 40)}
                  </Button>
                </li>
              ))}
            </ul>
          </Col>
        )}
        <Col className="" md={showSidebar ? 10 : 12}>
          <Container className="my-4">
            <Row className="mb-2">
              <Col
                className={classNames('d-flex', {
                  'justify-content-between': !showSidebar,
                  'justify-content-end': showSidebar,
                })}
              >
                {!showSidebar && (
                  <Button variant="dark" size="sm" onClick={partial(setShowSidebar, true)}>
                    <AiOutlineMenuFold />
                  </Button>
                )}
                {!isLastLesson && (
                  <Button variant="primary" size="sm" onClick={handlePressNextLesson}>
                    {/* <AiOutlineMenuFold /> */}
                    Next Lesson {' >'}
                  </Button>
                )}
                {isLastLesson && (
                  <Button variant="success" size="sm" onClick={handleCompleteCourse}>
                    {/* <AiOutlineMenuFold /> */}
                    Finish Course
                  </Button>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                {lessonInfo && (
                  <>
                    <h1 className="text-capitalize mb-2">{lessonInfo?.title}</h1>
                    {lessonInfo?.video?.Location && (
                      <Row className="">
                        <ReactPlayer
                          width={1280}
                          height={720}
                          controls
                          pip
                          light={course?.image?.Location}
                          url={lessonInfo?.video?.Location}
                        />
                      </Row>
                    )}
                    {lessonInfo?.content && (
                      <Row className="mt-4">
                        <ReactMarkdown>{lessonInfo?.content}</ReactMarkdown>
                      </Row>
                    )}
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </ProtectedUserPage>
  );
};

export default EnrolledUserLearnPage;
