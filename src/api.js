import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const IS_PROD = import.meta.env.PROD;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: IS_PROD ? 60_000 : 15_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('domus_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, Promise.reject);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('domus_token');
      localStorage.removeItem('domus_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiUrl = BASE_URL;
export default api;