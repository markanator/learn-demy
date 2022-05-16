import React from 'react';
import { Button } from 'antd';
import axios from '../../async/axios';
import { toast } from 'react-toastify';
import {
  LoadingOutlined,
  SettingOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import ProtectedUserPage from '../../components/ProtectedPages/UserRotues';
import { useAuth } from '../../context/auth.context';

const ApplyForInstructor = () => {
  const [loading, setLoading] = React.useState(false);
  const {
    state: { user },
  } = useAuth();

  const handleApply = () => {
    setLoading(true);
    axios
      .post('/auth/instructor/apply')
      .then(({ data }) => {
        console.log(data);
        // window.location.href = data?.url;
      })
      .catch((err) => {
        console.log(err.response.status);
        toast.error('Stripe onboarding failed. Try again.');
        setLoading(false);
      });
  };

  return (
    <ProtectedUserPage showSidebar={false}>
      <h1 className="jumbotron text-center bg-primary square py-4">
        Apply For Instructor
      </h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Setup payout to publish courses on edemy</h2>
              <p className="lead text-warning">
                Edemy partners with strip to transfer earning to your bank
                account.
              </p>
              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={handleApply}
                disabled={
                  (user && user.role && user.role.includes('Instructor')) ||
                  loading
                }
              >
                {loading ? 'Processing...' : 'Payout Setup'}
              </Button>
              <p className="lead">
                You will be redirected to Stripe to setup your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedUserPage>
  );
};

export default ApplyForInstructor;
