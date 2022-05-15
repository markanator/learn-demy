import { Menu } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  AppstoreOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/auth.context';
import { logoutUser } from '../async/api/auth';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const TopNav = () => {
  const { dispatch } = useAuth();
  const [current, setCurrent] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrent(window.location.pathname);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = await logoutUser();
      toast.success('Logged out successfully');
      dispatch({ type: 'LOGOUT' });
      console.log('LOGOUT', data);
      router.push('/');
    } catch (error) {
      toast.error('Logged out failed. Please try again');
      console.error(error?.response?.data?.message);
    }
  };

  return (
    <Menu mode="horizontal" selectedKeys={[current]}>
      <Menu.Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link href="/">App</Link>
      </Menu.Item>
      <Menu.Item
        key="/login"
        onClick={(e) => setCurrent(e.key)}
        icon={<LoginOutlined />}
      >
        <Link href="/login">Login</Link>
      </Menu.Item>
      <Menu.Item
        key="/register"
        onClick={(e) => setCurrent(e.key)}
        icon={<UserAddOutlined />}
      >
        <Link href="/register">Register</Link>
      </Menu.Item>
      <Menu.Item
        className="float-end"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        <>Logout</>
      </Menu.Item>
    </Menu>
  );
};

export default TopNav;
