import { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Button, message, Avatar, Dropdown } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  SettingOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { authService } from '../services/api';
import { layoutStyles, pageTitles } from '../styles';
import smuLogo from '../assets/Logo.png';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    message.success('You have been logged out successfully');
    navigate('/login');
  };

  // Get selected menu key based on current path
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.includes('/users')) return ['users'];
    if (path.includes('/students')) return ['students'];
    return ['dashboard'];
  };

  // Return null during initial loading
  if (!user) return null;

  // User dropdown menu items
  const userMenu = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => message.info('Profile feature coming soon')
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => message.info('Settings feature coming soon')
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  // Main menu items
  const mainMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'User Management',
      onClick: () => navigate('/users'),
    },
    {
      key: 'students',
      icon: <TeamOutlined />,
      label: 'Student Management',
      onClick: () => navigate('/students'),
    }
  ];

  // User initial for avatar
  const userInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
  
  // Get current page title
  const getPageTitle = () => {
    for (const [path, title] of Object.entries(pageTitles)) {
      if (location.pathname.includes(path)) return title;
    }
    return 'Dashboard';
  };

  // Get logo container style based on collapsed state
  const getLogoContainerStyle = () => {
    return {
      ...layoutStyles.logo,
      height: collapsed ? '70px' : '120px',
      padding: collapsed ? '8px' : '16px',
      transition: 'all 0.3s ease-in-out'
    };
  };

  // Get logo image style based on collapsed state
  const getLogoImageStyle = () => {
    return {
      ...layoutStyles.logoImage,
      height: collapsed ? '40px' : '90px',
      maxWidth: collapsed ? '60px' : '200px',
      transition: 'all 0.3s ease-in-out'
    };
  };

  return (
    <Layout style={layoutStyles.mainLayout}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={layoutStyles.sider}
        width={250}
      >
        <div style={getLogoContainerStyle()}>
          <img 
            src={smuLogo} 
            alt="Saint Mary's University" 
            style={getLogoImageStyle()}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={mainMenuItems}
        />
      </Sider>
      <Layout style={{ 
        ...layoutStyles.innerLayout,
        marginLeft: collapsed ? 80 : 250,
        transition: 'all 0.3s ease-in-out'
      }}>
        <Header style={layoutStyles.header}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={layoutStyles.menuButton}
            />
            <Title level={4} style={layoutStyles.pageTitle}>
              {getPageTitle()}
            </Title>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown menu={{ items: userMenu }} trigger={['click']} placement="bottomRight">
              <div style={layoutStyles.userDropdown}>
                <Avatar style={layoutStyles.avatar}>
                  {userInitial}
                </Avatar>
                <span style={layoutStyles.userName}>{user.firstName} {user.lastName}</span>
                <DownOutlined style={layoutStyles.dropdownIcon} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={layoutStyles.contentWrapper}>
          <div style={layoutStyles.content}>
            <Outlet />
          </div>
        </Content>
        <Footer style={layoutStyles.footer}>
          Student Information System ©{new Date().getFullYear()} Saint Mary's University
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout; 