import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Flask backend URL
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData - let the browser set it automatically
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Single response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized - don't use hooks here
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
      }
      
      // Return consistent error format
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.message || 'An error occurred',
        data: error.response.data,
      });
    }
    return Promise.reject(error);
  }
);

export default api;