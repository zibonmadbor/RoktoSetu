import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach Authorization Bearer token header to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if token is invalid or expired
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
