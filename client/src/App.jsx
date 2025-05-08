import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';

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
const Settings = () => <div><h1>Settings</h1><p>Settings page is under construction</p></div>;
const Courses = () => <div><h1>Courses</h1><p>Courses management page is under construction</p></div>;
const Schedules = () => <div><h1>Schedules</h1><p>Schedules page is under construction</p></div>;
const UserRoles = () => <div><h1>User Roles</h1><p>User Roles page is under construction</p></div>;
const Enrollments = () => <div><h1>Enrollments</h1><p>Enrollments page is under construction</p></div>;

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
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
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* User Management */}
            <Route path="users" element={<UserManagement />} />
            
            {/* Student Management */}
            <Route path="students" element={<StudentManagement />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
