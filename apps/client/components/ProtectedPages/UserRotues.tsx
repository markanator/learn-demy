import axios from '../../async/axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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

  return <>{children}</>;
};

export default ProtectedUserPage;
