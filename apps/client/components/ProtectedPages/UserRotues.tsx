import axios from '../../async/axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../UserNav/Sidebar';

type Props = {
  children: React.ReactNode;
};

const ProtectedUserPage = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/auth/me');
        if (data.ok) {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error?.message);
        setIsLoading(true);
        router.push('/login');
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10">
          <>{children}</>
        </div>
      </div>
    </div>
  );
};

export default ProtectedUserPage;
