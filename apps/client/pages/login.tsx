import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { loginUser } from '../async/api/auth';

// type Props = {};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await loginUser({ email, password });
      console.log(data);
      toast.success('Registered successfully!');
    } catch (error) {
      toast.error('An error occurred! Please try again.');
      console.error(error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <h1 className="jumbotron text-center bg-primary square">Login</h1>

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
          Not yet registered? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
