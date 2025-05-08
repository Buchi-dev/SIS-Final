import React, { useState } from 'react';
import { Layout, theme, Breadcrumb } from 'antd';
import { useLocation, Outlet, Link } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

const { Content, Footer } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar collapsed={collapsed} />
      <Layout>
        <AppHeader 
          collapsed={collapsed} 
          onToggleCollapse={() => setCollapsed(!collapsed)} 
        />
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