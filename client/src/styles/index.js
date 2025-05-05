// Export all styles for easy importing
export * from './theme';
export * from './MainLayout';
export * from './FormStyles';
export * from './TableStyles';
export * from './DashboardStyles';

// Add any global or common styles here
export const commonStyles = {
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  fullWidth: {
    width: '100%'
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '24px',
    background: '#fff'
  },
  pageHeader: {
    marginBottom: '24px',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '16px'
  },
  pageTitle: {
    marginBottom: '8px'
  },
  pageDescription: {
    color: 'rgba(0, 0, 0, 0.45)'
  },
  section: {
    marginBottom: '24px'
  },
  modalFooter: {
    marginTop: '24px'
  }
}; 