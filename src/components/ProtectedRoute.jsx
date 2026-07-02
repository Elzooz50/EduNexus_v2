// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROLE_ROUTES } from '../services/authStorage';
import { useAuth } from '../context/useAuth.js';
import './ProtectedRoute.css';
import logo from '../assets/icons/Logo.svg';

/**
 * @param {{ children: React.ReactNode, allowedRoles?: number[] }} props
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        
        <div className="auth-loading-card">
          <div className="auth-logo-wrapper">
             <div className="auth-logo-ring"></div>
             <img src={logo} alt="EduNexus" className="auth-logo-img" />
          </div>
          <h2 className="auth-loading-title">Edu<span className="auth-highlight">Nexus</span></h2>
          <p className="auth-loading-text">Authenticating your session<span className="loading-dots"></span></p>
        </div>
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