// src/services/authService.js

import apiClient from './apiClient';
import { saveAuthData, clearAuthData, getRoleFromToken, mapRoleNameToId } from './authStorage';

const enrichProfileFromToken = (profile, token) => {
  if (!profile?.roleId) {
    const roleNameFromToken = getRoleFromToken(token);
    if (roleNameFromToken) {
      const extractedRoleId = mapRoleNameToId(roleNameFromToken);
      if (extractedRoleId) {
        return {
          ...profile,
          roleId: extractedRoleId,
          role: { name: roleNameFromToken },
        };
      }
    }
  }

  return profile;
};

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

  // 3. Enrich profile with roleId from JWT token
  const profile = enrichProfileFromToken(loginResponse.user || {}, loginResponse.token);

  // 4. Ensure roleId is set (critical for redirects)
  if (!profile.roleId) {
    const roleNameFromToken = getRoleFromToken(loginResponse.token);
    if (roleNameFromToken) {
      profile.roleId = mapRoleNameToId(roleNameFromToken);
      profile.role = { name: roleNameFromToken };
    }
  }

  // 5. Save enriched profile to storage
  saveAuthData(loginResponse.token, profile);

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