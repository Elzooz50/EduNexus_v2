// src/services/apiClient.js

import axios from 'axios';
import { getAuthToken, clearAuthData } from './authStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://edunexus.runasp.net/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// ──────────────────────────────────────
// Request Interceptor
// ──────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // ONLY attach token if Authorization header is NOT already set
    // This prevents overwriting the token set by authService
    if (!config.headers.Authorization) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ──────────────────────────────────────
// Response Interceptor
// ──────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthData();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (/** @type {any} */ error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.title) return error.response.data.title;
  if (error?.message) return error.message;
  return fallback;
};

export default apiClient;