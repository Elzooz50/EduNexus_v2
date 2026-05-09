import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './super_admin_sidebar.css';

const SuperAdminSideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <aside className="sa-sidebar">
      <div className="sa-sidebar-header">
        <div className="sa-sidebar-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <span className="sa-sidebar-logo-text">Super Admin</span>
      </div>

      <nav className="sa-sidebar-nav">
        <NavLink
          to="/Super_Admin"
          end
          className={({ isActive }) => `sa-nav-item ${isActive ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/Super_Admin/Institutionas"
          className={({ isActive }) => `sa-nav-item ${isActive ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Institutionas</span>
        </NavLink>

        <NavLink
          to="/Super_Admin/User_Access"
          className={({ isActive }) => `sa-nav-item ${isActive ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>User Access</span>
        </NavLink>

        <button className="sa-nav-item sa-logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default SuperAdminSideBar;
