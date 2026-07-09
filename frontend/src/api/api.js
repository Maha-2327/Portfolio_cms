import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach admin token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expires/is invalid, clear it and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_user');
    }
    return Promise.reject(error);
  }
);

export default api;
