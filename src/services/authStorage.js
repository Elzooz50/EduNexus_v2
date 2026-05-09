// src/services/authStorage.js

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

/**
 * Save auth data to storage
 * @param {string} token - JWT token
 * @param {object} user - User object
 * @param {boolean} rememberMe - If true, use localStorage (persists). If false, use sessionStorage.
 */
export const saveAuthData = (token, user, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  
  if (token) storage.setItem(TOKEN_KEY, token);
  if (user) storage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get stored token
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
};

/**
 * Get stored user
 */
export const getAuthUser = () => {
  const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated (token exists and not expired)
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      clearAuthData();
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Clear all auth data
 */
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

/**
 * Get user role ID
 */
export const getUserRoleId = () => {
  const user = getAuthUser();
  return user?.roleId ? Number(user.roleId) : null;
};

// Role Constants
export const ROLES = {
  SUPER_ADMIN: 1,
  INST_ADMIN: 2,
  INSTRUCTOR: 3,
  STUDENT: 4,
};

export const ROLE_ROUTES = {
  [ROLES.SUPER_ADMIN]: '/Super_Admin',
  [ROLES.INST_ADMIN]: '/Inst_Admin',
  [ROLES.INSTRUCTOR]: '/Instructor_Home',
  [ROLES.STUDENT]: '/Student_Home',
};

export const ROLE_NAMES = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.INST_ADMIN]: 'Institutional Admin',
  [ROLES.INSTRUCTOR]: 'Instructor',
  [ROLES.STUDENT]: 'Student',
};