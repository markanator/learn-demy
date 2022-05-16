import Link from 'next/link';
import React, { useEffect } from 'react';
import classNames from 'classnames';
// type Props = {}

const InstructorSidebar = (props) => {
  const [curr, setCurr] = React.useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurr(window.location.pathname);
    }
  }, [curr]);
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ height: 'calc(100vh - 56px)' }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link href="/instructor" passHref>
            <a
              className={classNames('nav-link', {
                active: curr === '/instructor',
              })}
              aria-current="page"
            >
              Dashboard
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/instructor/course/create" passHref>
            <a
              className={classNames('nav-link', {
                active: curr === '/instructor/course/create',
              })}
            >
              Create Course
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default InstructorSidebar;
