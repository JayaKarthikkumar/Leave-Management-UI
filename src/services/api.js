import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// User API services
export const userService = {
  getCurrentUser: () => api.get('/users/me'),
  getAllEmployees: () => api.get('/users/employees'),
};

// Leave API services
export const leaveService = {
  createLeaveRequest: (leaveData) => api.post('/leaves', leaveData),
  getUserLeaveRequests: () => api.get('/leaves/me'),
  getAllLeaveRequests: () => api.get('/leaves/all'),
  updateLeaveRequestStatus: (id, statusData) => api.patch(`/leaves/${id}`, statusData),
}; 