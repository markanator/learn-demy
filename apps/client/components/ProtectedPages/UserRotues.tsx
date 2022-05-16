import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../async/api/auth';
import Sidebar from '../UserNav/Sidebar';

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
        const { data } = await getCurrentUser();
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
    <div className="container-fluid ps-0">
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
