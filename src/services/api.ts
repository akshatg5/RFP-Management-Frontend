import { BASE_API_URL } from '@/config/api';
import axios, { AxiosResponse } from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;