import ProtectedUserPage from '../../components/ProtectedPages/UserRotues';
import React from 'react';
import Sidebar from '../../components/UserNav/Sidebar';

// type Props = {}

const UserHomePage = (props) => {
  return (
    <ProtectedUserPage>
      <h1>USER HOME PAGE</h1>
    </ProtectedUserPage>
  );
};

export default UserHomePage;
