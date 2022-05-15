import { Menu } from 'antd';
import Link from 'next/link';
import React from 'react';
import {
  AppstoreOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

const TopNav = () => {
  return (
    <Menu mode="horizontal">
      <Menu.Item icon={<AppstoreOutlined />}>
        <Link href="/">App</Link>
      </Menu.Item>
      <Menu.Item icon={<LoginOutlined />}>
        <Link href="/login">Login</Link>
      </Menu.Item>
      <Menu.Item icon={<UserAddOutlined />}>
        <Link href="/register">Register</Link>
      </Menu.Item>
    </Menu>
  );
};

export default TopNav;
