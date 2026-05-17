// src/services/authStorage.js

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

/**
 * Save auth data to storage
 * @param {string} token - JWT token
 * @param {object} user - User object
 * @param {boolean} rememberMe - Unused; auth data is always stored in localStorage for cross-tab sync.
 */
export const saveAuthData = (token, user) => {
  // Always use localStorage for auth data to enable cross-tab synchronization
  // This ensures that login state persists across tabs and page reloads
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
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

/**
 * Decode JWT token and extract role claim
 * @param {string} token - JWT token
 * @returns {string|null} Role name or null
 */
export const getRoleFromToken = (token) => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    // Extract role from Microsoft identity claims
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  } catch {
    return null;
  }
};

/**
 * Map role name to roleId
 * @param {string} roleName - Role name (e.g., 'Student', 'Instructor')
 * @returns {number|null} Role ID or null
 */
export const mapRoleNameToId = (roleName) => {
  if (!roleName) return null;

  // Normalize role name to handle variations from backend tokens
  const normalized = roleName
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_\\-]/g, ' ')
    .replace(/\s+/g, ' ');

  // Heuristic checks to map various role name variants to our role IDs
  if (normalized.includes('super') && normalized.includes('admin')) return ROLES.SUPER_ADMIN;
  if (normalized.includes('inst') || normalized.includes('institution') || normalized.includes('institute')) return ROLES.INST_ADMIN;
  if (normalized.includes('instructor')) return ROLES.INSTRUCTOR;
  if (normalized.includes('student')) return ROLES.STUDENT;
  if (normalized === 'admin') return ROLES.INST_ADMIN;

  // Fallback explicit map for common exact names
  const roleMap = {
    'super admin': ROLES.SUPER_ADMIN,
    'institutional admin': ROLES.INST_ADMIN,
    'superadmin': ROLES.SUPER_ADMIN,
    'instadmin': ROLES.INST_ADMIN,
    'instructor': ROLES.INSTRUCTOR,
    'student': ROLES.STUDENT,
    'institute': ROLES.INST_ADMIN,
    'institute admin': ROLES.INST_ADMIN,
  };

  return roleMap[normalized] || null;
};