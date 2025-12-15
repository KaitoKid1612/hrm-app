import axios from 'axios';
import { toast } from './toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }

    // Don't show toast for these cases (let components handle them)
    // - 400 errors from form validation (component shows field errors)
    // - 404 errors (component shows "not found" state)
    const shouldShowToast = error.response?.status !== 400 && error.response?.status !== 404;

    if (shouldShowToast) {
      toast.error(error);
    }

    return Promise.reject(error);
  },
);

export default api;
