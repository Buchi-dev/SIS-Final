// MainLayout component styles
export const layoutStyles = {
  sider: {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
    zIndex: 2
  },
  logo: {
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '16px',
    transition: 'all 0.3s'
  },
  logoImage: {
    transition: 'all 0.3s',
    maxWidth: '100%',
    objectFit: 'contain'
  },
  header: { 
    padding: '0 24px', 
    background: '#fff', 
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    boxShadow: '0 2px 8px rgba(0,21,41,0.08)',
  },
  content: {
    padding: '24px',
    background: '#fff',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  userDropdown: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.3s'
  },
  mainLayout: {
    minHeight: '100vh'
  },
  innerLayout: {
    transition: 'all 0.2s'
  },
  logoTitle: {
    color: 'white',
    margin: 0,
    whiteSpace: 'nowrap'
  },
  menuButton: {
    fontSize: '16px',
    marginRight: '24px'
  },
  pageTitle: {
    margin: 0
  },
  avatar: {
    backgroundColor: '#2c2f7a',
    marginRight: '8px'
  },
  userName: {
    marginRight: '4px'
  },
  dropdownIcon: {
    fontSize: '12px'
  },
  contentWrapper: {
    margin: '24px',
    minHeight: 280
  },
  footer: {
    textAlign: 'center',
    padding: '12px 50px'
  }
};

// Page titles mapping
export const pageTitles = {
  '/dashboard': 'Dashboard',
  '/users': 'User Management',
  '/students': 'Student Management'
}; 