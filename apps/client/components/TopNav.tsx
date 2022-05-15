import { Menu } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  AppstoreOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

const TopNav = () => {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrent(window.location.pathname);
    }
  }, []);
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
    </Menu>
  );
};

export default TopNav;
