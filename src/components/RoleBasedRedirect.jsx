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
    const roleId = user?.roleId ? Number(user.roleId) : null;
    if (!roleId) return null; // don't redirect if we don't know their role yet

    const redirectPath = ROLE_ROUTES[roleId] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return null;
};

export default RoleBasedRedirect;