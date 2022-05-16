import React from 'react';
import ProtectedUserPage from '../../components/ProtectedPages/UserRotues';

// type Props = {}

const UserHomePage = (props) => {
  return (
    <ProtectedUserPage>
      <h1>USER HOME PAGE</h1>
    </ProtectedUserPage>
  );
};

export default UserHomePage;
