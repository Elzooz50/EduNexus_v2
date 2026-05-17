// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROLE_ROUTES } from '../services/authStorage';
import { useAuth } from '../context/useAuth.js';

/**
 * @param {{ children: React.ReactNode, allowedRoles?: number[] }} props
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Not authenticated → login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access check
  if (allowedRoles.length > 0 && user) {
    const userRoleId = Number(user.roleId);
    if (!allowedRoles.includes(userRoleId)) {
      // Redirect to their own dashboard
      return <Navigate to={ROLE_ROUTES[userRoleId] || '/login'} replace />;
    }
  }

  // Authenticated + authorized → render children
  return <>{children}</>;
};

export default ProtectedRoute;