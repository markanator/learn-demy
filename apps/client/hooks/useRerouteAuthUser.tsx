import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/auth.context';

const useRerouteAuthUser = () => {
  const router = useRouter();
  const {
    state: { user },
  } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};

export default useRerouteAuthUser;
