import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, theme, Breadcrumb } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import authService from '../../services/authService';

const { Header, Sider, Content, Footer } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    
    const breadcrumbItems = [
      {
        title: <Link to="/">Home</Link>,
        key: 'home'
      }
    ];
    
    let url = '';
    pathSnippets.forEach(snippet => {
      url += `/${snippet}`;
      const title = snippet.charAt(0).toUpperCase() + snippet.slice(1);
      breadcrumbItems.push({
        title: <Link to={url}>{title}</Link>,
        key: url
      });
    });
    
    return breadcrumbItems;
  };

  // Menu items for the sidebar - simplified to only include necessary items
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

  // User dropdown menu
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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={260}
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 10
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 20px',
        }}>
          <div style={{ 
            color: 'white', 
            fontSize: collapsed ? '16px' : '20px',
            fontWeight: 'bold',
          }}>
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
      <Layout>
        <Header style={{ 
          padding: '0 16px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
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
        <Content
          style={{
            margin: '16px',
            padding: 0,
            minHeight: 280,
            background: '#f0f2f5',
          }}
        >
          <Breadcrumb 
            items={getBreadcrumbItems()}
            style={{ 
              margin: '16px 24px',
            }}
          />
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              margin: '0 16px 16px'
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Student Information System ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 