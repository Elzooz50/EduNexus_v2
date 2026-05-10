// src/services/authService.js

import apiClient from './apiClient';
import { saveAuthData, clearAuthData, getRoleFromToken, mapRoleNameToId } from './authStorage';

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
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.token}`;

  // 3. Save token to storage (for page reloads)
  saveAuthData(loginResponse.token, loginResponse.user, credentials.rememberMe);

  // 4. Fetch full profile
  const profile = await fetchProfile();

  // 5. WORKAROUND: If roleId is null but role is missing, extract from JWT token
  if (!profile.roleId) {
    const roleNameFromToken = getRoleFromToken(loginResponse.token);
    if (roleNameFromToken) {
      const extractedRoleId = mapRoleNameToId(roleNameFromToken);
      if (extractedRoleId) {
        profile.roleId = extractedRoleId;
        profile.role = { name: roleNameFromToken };
      }
    }
  }

  // 6. Update stored user with FULL profile
  saveAuthData(loginResponse.token, profile, credentials.rememberMe);

  return {
    token: loginResponse.token,
    user: profile,
  };
};

// ──────────────────────────────────────
// NEW: Update account profile
// ──────────────────────────────────────
/**
 * Update account profile
 * @param {Object} data - Profile data
 * @param {string} data.ssn
 * @param {string} data.firstName
 * @param {string} data.secondName
 * @param {string} data.thirdName
 * @param {string} data.lastName
 * @param {string} data.phoneNumber
 * @param {string} data.email
 * @returns {Promise<{message: string}>}
 */
export const updateAccount = async (data) => {
  const response = await apiClient.put('/Account/update-account', data);
  return response.data;
};

// ──────────────────────────────────────
// NEW: Change password
// ──────────────────────────────────────
/**
 * Change user password
 * @param {string} userId - User ID
 * @param {Object} passwords - Password data
 * @param {string} passwords.currentPassword
 * @param {string} passwords.newPassword
 * @param {string} passwords.confirmPassword
 * @returns {Promise<{success: boolean, message: string, errors?: string[]}>}
 */
export const changePassword = async (userId, passwords) => {
  const response = await apiClient.post(`/Auth/change-password/${userId}`, passwords);
  return response.data;
};

// ──────────────────────────────────────
// NEW: Logout from server
// ──────────────────────────────────────
/**
 * Logout from server
 * @returns {Promise<{success: boolean, message: string, errors?: string[]}>}
 */
export const logoutFromServer = async () => {
  const response = await apiClient.post('/Auth/logout');
  return response.data;
};

/**
 * Logout (local only)
 */
export const logout = () => {
  delete apiClient.defaults.headers.common['Authorization'];
  clearAuthData();
};