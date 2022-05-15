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
      <Menu.Item>
        <Link href="/">App</Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/login">Login</Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/register">Register</Link>
      </Menu.Item>
    </Menu>
  );
};

export default TopNav;
