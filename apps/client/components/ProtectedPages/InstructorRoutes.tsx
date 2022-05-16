import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getCurrentInstructors } from '../../async/api/instructors';
import InstructorSidebar from '../UserNav/InstructorNav';
import { Container } from 'react-bootstrap';

type Props = {
  showSidebar?: boolean;
  children: React.ReactNode;
};

export const ProtectedInstructorPage = ({
  showSidebar = true,
  children,
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getCurrentInstructors();
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
    <Container fluid>
      <div className="row">
        {showSidebar && (
          <div className="col-md-2 px-0">
            <InstructorSidebar />
          </div>
        )}
        <div
          className={classNames({
            'col-md-10': showSidebar,
            'col px-0': !showSidebar,
          })}
        >
          <>{children}</>
        </div>
      </div>
    </Container>
  );
};
