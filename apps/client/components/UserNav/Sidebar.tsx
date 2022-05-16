import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
// type Props = {}

const Sidebar = () => {
  const [curr, setCurr] = useState('');
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
          <Link href="/user" passHref>
            <a
              className={classNames('nav-link', {
                active: curr === '/user',
              })}
            >
              Dashboard
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
