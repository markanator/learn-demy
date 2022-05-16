import axios from '../../async/axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../UserNav/Sidebar';
import classNames from 'classnames';

type Props = {
  showSidebar?: boolean;
  children: React.ReactNode;
};

const ProtectedUserPage = ({ showSidebar = true, children }: Props) => {
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
        {showSidebar && (
          <div className="col-md-2">
            <Sidebar />
          </div>
        )}
        <div
          className={classNames({
            'col-md-10': showSidebar,
            col: !showSidebar,
          })}
        >
          <>{children}</>
        </div>
      </div>
    </div>
  );
};

export default ProtectedUserPage;
