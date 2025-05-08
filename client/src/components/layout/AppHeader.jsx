import React from 'react';
import { Layout, Button, Avatar, Dropdown, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const { Header } = Layout;

const AppHeader = ({ collapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const userMenu = {
    items: [
      {
        key: '1',
        label: 'Logout',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleCollapse}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div>
        <Dropdown menu={userMenu} placement="bottomRight">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Avatar icon={<UserOutlined />} />
            {currentUser && (
              <span style={{ marginLeft: 8, marginRight: 4 }}>
                {currentUser.email || 'User'}
              </span>
            )}
            <DownOutlined style={{ fontSize: '12px' }} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader; 