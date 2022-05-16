import React, { useEffect } from 'react';
import { useAuth } from '../../context/auth.context';
import { SyncOutlined } from '@ant-design/icons';
import { getAccountStatus } from '../../async/api/instructors';
import { useRouter } from 'next/router';

const StripeCallbackPage = () => {
  const router = useRouter();
  const {
    state: { user },
    dispatch,
  } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }
    getAccountStatus()
      .then(({ data }) => {
        console.log('ACCOUNT STATUS', data);
        dispatch({
          type: 'LOGIN',
          payload: data,
        });
        router.push('/instructor');
      })
      .catch((err) => {
        console.warn('ERROR', err?.message);
      });
  }, [user, dispatch, router]);
  return (
    <div
      className="d-flex w-100 justify-content-center align-items-center"
      style={{ height: '50vh' }}
    >
      <SyncOutlined spin className="text-primary fs-1" />
    </div>
  );
};

export default StripeCallbackPage;
