// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginAndFetchProfile, fetchProfile } from '../services/authService';
import {
  saveAuthData,
  getAuthToken,
  getAuthUser,
  clearAuthData,
  ROLE_ROUTES,
  ROLE_NAMES,
  isAuthenticated as checkAuth,
} from '../services/authStorage';

/**
 * @typedef {Object} AuthContextType
 * @property {Object|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {boolean} profileLoading
 * @property {Function} login
 * @property {Function} logout
 * @property {Function} refreshProfile
 * @property {number|null} roleId
 * @property {string|null} roleName
 */

/** @type {React.Context<AuthContextType>} */
const AuthContext = createContext(/** @type {any} */(null));

/**
 * Hook to use the Auth context
 * @returns {AuthContextType} The auth context
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return /** @type {AuthContextType} */ (context);
};

/**
 * Auth Provider component that wraps the app
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactElement}
 */
export const AuthProvider = ({ children }) => {
  /** @type {[any, Function]} */
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Initialize: Check stored auth & refresh profile
  useEffect(() => {
    const initAuth = async () => {
      if (checkAuth()) {
        const storedUser = getAuthUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuth(true);
          
          // Refresh profile in background
          try {
            const freshProfile = await fetchProfile();
            const token = getAuthToken();
            if (token) {
              saveAuthData(token, freshProfile, true); // keep rememberMe consistent
            }
            setUser(freshProfile);
          } catch {
            // If profile fetch fails, keep stored user
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  /**
   * Login handler
   * @param {Object} credentials
   * @param {string} credentials.ssnOrEmail
   * @param {string} credentials.password
   * @param {boolean} [credentials.rememberMe]
   * @returns {Promise<Object>}
   */
  const login = useCallback(async (/** @type {any} */ credentials) => {
    const result = /** @type {any} */ (await loginAndFetchProfile(credentials));

    setUser(result.user);
    setIsAuth(true);

    return {
      user: result.user,
      redirectPath: ROLE_ROUTES[Number(result.user.roleId)] || '/login',
      roleName: ROLE_NAMES[Number(result.user.roleId)] || 'User',
    };
  }, []);

  // Refresh profile manually
  const refreshProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const profile = await fetchProfile();
      const token = getAuthToken();
      if (token) {
        saveAuthData(token, profile, true);
      }
      setUser(profile);
      return profile;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    clearAuthData();
    setUser(null);
    setIsAuth(false);
  }, []);

  const value = {
    user,
    isAuthenticated: isAuth,
    isLoading,
    profileLoading,
    login,
    logout,
    refreshProfile,
    roleId: user?.roleId ? Number(user?.roleId) : null,
    roleName: (user?.role?.name) || (ROLE_NAMES[Number(user?.roleId)]) || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export default AuthContext;