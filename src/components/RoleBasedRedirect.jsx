// src/components/RoleBasedRedirect.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { ROLE_ROUTES } from '../services/authStorage';

/**
 * Redirects already-authenticated users away from public pages (like /login)
 * to their role-specific dashboard.
 */
const RoleBasedRedirect = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated && user) {
    const redirectPath = ROLE_ROUTES[Number(user.roleId)] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return null;
};

export default RoleBasedRedirect;