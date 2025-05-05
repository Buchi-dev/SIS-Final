import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to handle API requests
const apiRequest = async (method, url, data = null) => {
  try {
    const config = { method, url };
    if (data) config.data = data;
    
    const response = await api(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

// Auth services
export const authService = {
  // Register a new user
  register: async (userData) => apiRequest('post', '/users/register', userData),

  // Login user
  login: async (credentials) => {
    const data = await apiRequest('post', '/users/login', credentials);
    
    // Store user data in localStorage for persistence
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// User management services
export const userService = {
  // Get all users
  getAllUsers: async () => apiRequest('get', '/users'),

  // Get user by ID
  getUserById: async (userId) => apiRequest('get', `/users/${userId}`),

  // Update user
  updateUser: async (userId, userData) => apiRequest('put', `/users/${userId}`, userData),

  // Delete user
  deleteUser: async (userId) => apiRequest('delete', `/users/${userId}`),

  // Change user password
  changePassword: async (userId, passwordData) => 
    apiRequest('put', `/users/${userId}/password`, passwordData),

  // Get current user profile
  getProfile: async () => apiRequest('get', '/users/profile'),

  // Update current user profile
  updateProfile: async (profileData) => apiRequest('put', '/users/profile', profileData)
};

// Student services
export const studentService = {
  // Create a new student profile
  createStudent: async (studentData) => 
    apiRequest('post', '/students/profile', studentData),

  // Get student profile by studentId
  getStudent: async (studentId) => 
    apiRequest('get', `/students/profile/${studentId}`),

  // Update student profile
  updateStudent: async (studentId, studentData) => 
    apiRequest('put', `/students/profile/${studentId}`, studentData),

  // Delete student profile
  deleteStudent: async (studentId) => 
    apiRequest('delete', `/students/profile/${studentId}`),
  
  // Get all student profiles
  getAllStudents: async () => apiRequest('get', '/students')
};

export default api; 