import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const signup = (userData) => api.post('/auth/signup', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, newPassword) => api.post(`/auth/reset-password/${token}`, { password: newPassword });

// User
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (profileData) => api.put('/users/profile', profileData);

// Tasks
export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Projects
export const getProjects = () => api.get('/projects');
export const createProject = (projectData) => api.post('/projects', projectData);
export const getProject = (id) => api.get(`/projects/${id}`);
export const updateProject = (id, projectData) => api.patch(`/projects/${id}`, projectData);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export default api;
