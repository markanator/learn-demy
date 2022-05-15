import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { forgotPassword, resetPassword } from '../async/api/auth';
import useRerouteAuthUser from '../hooks/useRerouteAuthUser';

// type Props = {}

const ForgotPasswordPage = (props) => {
  useRerouteAuthUser();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword({ email });
      // console.log('REQUEST RESET PASSWORD', data);
      toast.info('An email has been sent to you with a code.');
      setSuccess(true);
    } catch (error) {
      console.log('testing');
      toast.error('An error occurred! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    console.log('HANDLE RESET PASSWORD');
    // return;
    setIsLoading(true);
    try {
      const { data } = await resetPassword({ email, code, newPassword });
      console.log('RESET PASS DATA', data);
      setEmail('');
      setCode('');
      setNewPassword('');
      setSuccess(false);
      toast.success('Password changed successfully!');
    } catch (error) {
      console.log('testing');
      toast.error('An error occurred! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="jumbotron text-center bg-primary square py-4 mb-4">
        Forgot Password
      </h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={success ? handleUpdatePassword : handleSubmit}>
          <fieldset disabled={isLoading}>
            <input
              type="email"
              className="form-control mb-4 p-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              disabled={success}
            />
            {success && (
              <>
                <input
                  name="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter Code from email"
                  className="form-control mb-4 p-4"
                  required
                />
                <input
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="form-control mb-4 p-4"
                  required
                />
              </>
            )}
          </fieldset>

          <button
            type="submit"
            disabled={!email || isLoading}
            className="btn btn-block btn-primary"
          >
            {!isLoading ? 'Submit' : <SyncOutlined spin />}
          </button>
        </form>
        <p className="mt-4">
          Remembered your password? <Link href="/login">Login</Link>
        </p>
        <p className="mt-4">
          Not yet registered? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
