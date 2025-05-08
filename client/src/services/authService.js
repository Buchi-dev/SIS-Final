import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
const USER_KEY = 'currentUser';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  setCurrentUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeCurrentUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user && !!user.token;
  },

  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role;
  },

  hasRole: (role) => {
    const userRole = authService.getUserRole();
    return userRole === role;
  },
};

export default authService; 