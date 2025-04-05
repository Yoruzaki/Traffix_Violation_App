import axios from 'axios';

// Determine the base URL based on environment
const isProduction = process.env.NODE_ENV === 'production';
const baseURL = isProduction 
  ? 'https://api-traffix.onrender.com'  // Your Render API URL
  : 'http://localhost:5000';                   // Local development

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,  // 10 second timeout
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
