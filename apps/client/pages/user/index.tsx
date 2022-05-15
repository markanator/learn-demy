import ProtectedUserPage from '../../components/ProtectedPages/UserRotues';
import React from 'react';

// type Props = {}

const UserHomePage = (props) => {
  return (
    <ProtectedUserPage>
      <h1>User Home Page</h1>
    </ProtectedUserPage>
  );
};

export default UserHomePage;
