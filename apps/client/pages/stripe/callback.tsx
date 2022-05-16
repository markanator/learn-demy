import ProtectedUserPage from '../../components/ProtectedPages/UserRotues';
import React, { useEffect } from 'react';
import { useAuth } from '../../context/auth.context';
import { SyncOutlined } from '@ant-design/icons';
import { getAccountStatus } from '../../async/api/auth';

// type Props = {}

const StripeCallbackPage = (props) => {
  const {
    state: { user },
  } = useAuth();

  useEffect(() => {
    if (user) {
      getAccountStatus()
        .then(({ data }) => {
          console.log('ACCOUNT STATUS', data);
          window.location.href = '/isntructor';
        })
        .catch((err) => {
          console.warn('ERROR', err?.message);
        });
    }
  }, [user]);
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
