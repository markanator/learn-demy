import Link from 'next/link';
import React from 'react';

// type Props = {}

const InstructorSidebar = (props) => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: '280px', height: 'calc(100vh - 56px)' }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link href="/instructor" passHref>
            <a className="nav-link active" aria-current="page">
              Dashboard
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/instructor/course/create" passHref>
            <a className="nav-link">Create Course</a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default InstructorSidebar;
