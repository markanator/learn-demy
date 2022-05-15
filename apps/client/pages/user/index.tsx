import axios from '../../async/axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth.context';

// type Props = {}

const UserHomePage = (props) => {
  const [hidden, setHidden] = useState(true);

  const {
    state: { user },
  } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/auth/me');
        console.log(data);
        setHidden(false);
      } catch (error) {
        console.log(error?.message);
        setHidden(true);
      }
    };
    fetchUser();
  }, []);

  if (hidden) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>User Home Page</h1>
      <pre>{}</pre>
    </>
  );
};

export default UserHomePage;
