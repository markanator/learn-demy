import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { loginUser } from '../async/api/auth';
import { useAuth } from '../context/auth.context';
import useRerouteAuthUser from '../hooks/useRerouteAuthUser';

const Login = () => {
  const router = useRouter();
  useRerouteAuthUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await loginUser({ email, password });
      toast.success('Successfully logged in!');
      dispatch({ type: 'LOGIN', payload: data });
      router.push('/user');
    } catch (error) {
      toast.error('An error occurred! Please try again.');
      console.error(error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="jumbotron text-center bg-primary square py-4">Login</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <button
            type="submit"
            disabled={!email || !password || isLoading}
            className="btn btn-block btn-primary"
          >
            {!isLoading ? 'Login' : <SyncOutlined />}
          </button>
        </form>
        <p className="mt-4">
          Forgot your password?{' '}
          <Link href="/forgot-password">Forgot Password</Link>
        </p>
        <p className="mt-4">
          Not yet registered? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
