import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: 'User Management',
  },
  {
    key: '/students',
    icon: <TeamOutlined />,
    label: 'Student Management',
  },
];

const AppSidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      style={{
        boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
        zIndex: 10,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 20px',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: collapsed ? '16px' : '20px',
            fontWeight: 'bold',
          }}
        >
          {collapsed ? 'SIS' : 'Student Info System'}
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default AppSidebar; 