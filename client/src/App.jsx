import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './pages/auth/ProtectedRoute';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages
import Dashboard from './pages/dashboard/Dashboard';
import UserManagement from './pages/users/UserManagement';
import StudentManagement from './pages/students/StudentManagement';

// Placeholder for additional pages

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AntApp>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* User Management */}
              <Route path="users" element={<UserManagement />} />
              
              {/* Student Management */}
              <Route path="students" element={<StudentManagement />} />
              
            </Route>
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
