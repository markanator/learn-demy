import { useState } from 'react';
import { toast } from 'react-toastify';
import { registerNewUser } from '../async/api/auth';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await registerNewUser({ name, email, password });
      console.log(data);
      toast.success('Registered successfully!');
    } catch (error) {
      toast.error(error?.response?.data);
      console.error(error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Register</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-4 p-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            required
          />

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
            disabled={!name || !email || !password || isLoading}
            className="btn btn-block btn-primary"
          >
            {!isLoading ? 'Submit' : <SyncOutlined />}
          </button>
        </form>
        <p className="mt-4">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default Register;
