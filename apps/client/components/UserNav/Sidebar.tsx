import Link from 'next/link';
import React from 'react';

// type Props = {}

const Sidebar = (props) => {
  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/user" passHref>
        <a className="nav-link active">Dashboard</a>
      </Link>
    </div>
  );
};

export default Sidebar;
