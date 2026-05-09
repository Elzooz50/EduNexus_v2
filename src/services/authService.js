// src/services/authService.js

import apiClient from './apiClient';
import { saveAuthData, clearAuthData } from './authStorage';

/**
 * Login with SSN or Email
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.ssnOrEmail - User SSN or Email
 * @param {string} credentials.password - User password
 * @param {boolean} [credentials.rememberMe] - Remember login
 * @returns {Promise<{success: boolean, token: string, user: Object, message?: string}>}
 */
export const loginWithSsnOrEmail = async ({ ssnOrEmail, password, rememberMe }) => {
  const response = await apiClient.post('/Auth/login', {
    ssnOrEmail,
    password,
    rememberMe,
  });
  return response.data;
};

/**
 * Fetch full profile
 * @returns {Promise<Object>} User profile data
 */
export const fetchProfile = async () => {
  // DO NOT manually set Authorization header — let the interceptor do it
  const response = await apiClient.get('/Account/profile');
  return response.data;
};

/**
 * Complete login flow
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.ssnOrEmail - User SSN or Email
 * @param {string} credentials.password - User password
 * @param {boolean} [credentials.rememberMe] - Remember login
 * @returns {Promise<{token: string, user: Object}>}
 */
export const loginAndFetchProfile = async (credentials) => {
  // 1. Login
  const loginResponse = await loginWithSsnOrEmail(credentials);

  if (!loginResponse.success) {
    throw new Error(loginResponse.message || 'Login failed');
  }

  // 2. Set the token directly on the apiClient default headers
  //    This ensures ALL subsequent requests use this token
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.token}`;

  // 3. Save token to storage (for page reloads)
  saveAuthData(loginResponse.token, loginResponse.user, credentials.rememberMe);

  // 4. Fetch full profile
  const profile = await fetchProfile();

  // 5. Update stored user with FULL profile
  saveAuthData(loginResponse.token, profile, credentials.rememberMe);

  return {
    token: loginResponse.token,
    user: profile,
  };
};

/**
 * Logout
 */
export const logout = () => {
  // Remove the default header
  delete apiClient.defaults.headers.common['Authorization'];
  clearAuthData();
};