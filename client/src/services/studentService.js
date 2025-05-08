import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:3000/api';

// Add auth token to requests
axios.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const studentService = {
  getAllStudents: async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await axios.post(`${API_URL}/students/profile`, studentData);
      return response.data.student;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateStudent: async (id, studentData) => {
    try {
      const response = await axios.put(`${API_URL}/students/profile/${studentData.idNumber}`, studentData);
      return response.data.student;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/students/id/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteStudent: async (id) => {
    try {
      // Get the student by ID to get the idNumber
      const student = await studentService.getStudentById(id);
      const response = await axios.delete(`${API_URL}/students/profile/${student.idNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default studentService; 