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
  getRoleFromToken,
  mapRoleNameToId,
} from '../services/authStorage';

/**
 * @typedef {Object} User
 * @property {string} [fullName]
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [email]
 * @property {{name?:string}} [role]
 * @property {number} [roleId]
 * @property {boolean} [isActive]
 * @property {boolean} [emailConfirmed]
 * @property {string} [phoneNumber]
 * @property {number} [gender]
 * @property {Array<any>} [studentCourses]
 * @property {Array<any>} [groups]
 * @property {Array<any>} [attendances]
 * @property {Array<any>} [answerAttempts]
 * @property {Array<any>} [courseInstructors]
 * @property {Array<any>} [instituteInstructors]
 * @property {Array<any>} [meetings]
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {boolean} profileLoading
 * @property {(credentials: any) => Promise<any>} login
 * @property {() => void} logout
 * @property {() => Promise<User|null>} refreshProfile
 * @property {number|null} roleId
 * @property {string|null} roleName
 */

/** @type {React.Context<AuthContextType>} */
const AuthContext = createContext(/** @type {any} */ (null));

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
  /** @type {[User|null, Function]} */
  const [user, setUser] = useState(/** @type {User|null} */ (null));
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  /**
   * Enrich user object with roleId if missing
   * @param {User} userObj
   * @returns {User}
   */
  const enrichUserWithRole = useCallback((userObj) => {
    if (userObj && !userObj.roleId) {
      const token = getAuthToken();
      const roleNameFromToken = getRoleFromToken(token);
      if (roleNameFromToken) {
        const extractedRoleId = mapRoleNameToId(roleNameFromToken);
        if (extractedRoleId) {
          userObj.roleId = extractedRoleId;
          userObj.role = { name: roleNameFromToken };
        }
      }
    }
    return userObj;
  }, []);

  // Initialize: Check stored auth & refresh profile
  useEffect(() => {
    const initAuth = async () => {
      if (checkAuth()) {
        const storedUser = getAuthUser();
        if (storedUser) {
          const enrichedUser = enrichUserWithRole(storedUser);
          setUser(enrichedUser);
          setIsAuth(true);
          
          // Refresh profile in background
          try {
            const freshProfile = await fetchProfile();
            const enrichedProfile = enrichUserWithRole(freshProfile);
            const token = getAuthToken();
            if (token) {
              saveAuthData(token, enrichedProfile, true); // keep rememberMe consistent
            }
            setUser(enrichedProfile);
          } catch {
            // If profile fetch fails, keep stored user
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();

    // Listen for auth changes from other tabs (cross-tab synchronization)
    const handleStorageChange = (event) => {
      if (event.key === 'user' || event.key === 'accessToken') {
        if (event.newValue) {
          // Auth data was updated in another tab
          const storedUser = getAuthUser();
          if (storedUser) {
            const enrichedUser = enrichUserWithRole(storedUser);
            setUser(enrichedUser);
            setIsAuth(true);
          }
        } else if (!event.newValue) {
          // Auth data was cleared (logout) in another tab
          setUser(null);
          setIsAuth(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [enrichUserWithRole]);

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
      // If roleId is missing, fall back to root so user isn't stuck on /login
      redirectPath: ROLE_ROUTES[Number(result.user.roleId)] || '/',
      roleName: ROLE_NAMES[Number(result.user.roleId)] || 'User',
    };
  }, []);

  // Refresh profile manually
  const refreshProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const profile = await fetchProfile();
      const enrichedProfile = enrichUserWithRole(profile);
      const token = getAuthToken();
      if (token) {
        saveAuthData(token, enrichedProfile, true);
      }
      setUser(enrichedProfile);
      return enrichedProfile;
    } finally {
      setProfileLoading(false);
    }
  }, [enrichUserWithRole]);

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