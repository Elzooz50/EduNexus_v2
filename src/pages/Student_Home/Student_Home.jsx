// src/pages/Student_Home/Student_Home.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './student_home.css';

const Student_Home = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user;
  const refreshProfile = authContext?.refreshProfile;
  const logout = authContext?.logout;

  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Student';
  const firstName = user?.firstName || 'Student';
  const email = user?.email || '';
  const roleName = user?.role?.name || 'Student';
  const isActive = user?.isActive ?? true;
  const emailConfirmed = user?.emailConfirmed ?? false;
  const phoneNumber = user?.phoneNumber || 'Not provided';
  // eslint-disable-next-line no-unused-vars
  const gender = user?.gender === 0 ? 'Male' : user?.gender === 1 ? 'Female' : 'Not specified';

  const studentCourses = user?.studentCourses || [];
  const groups = user?.groups || [];
  const attendances = user?.attendances || [];
  const answerAttempts = user?.answerAttempts || [];

  const stats = [
    { label: 'Enrolled Courses', value: studentCourses.length },
    { label: 'My Groups', value: groups.length },
    { label: 'Attendance Records', value: attendances.length },
    { label: 'Assignments Done', value: answerAttempts.length },
  ];

  const handleLogout = async () => {
    try {
      await import('../../services/authService').then(m => m.logoutFromServer());
    } catch {
      // Server logout may fail, still clear local
    }
    logout?.();
    navigate('/login', { replace: true });
  };

  return (
    <div className="student-home">
      {/* ─────── Top Action Bar ─────── */}
      <div className="sh-action-bar">
        <div className="sh-breadcrumb">
          <span className="sh-breadcrumb-item">Home</span>
          <span className="sh-breadcrumb-separator">/</span>
          <span className="sh-breadcrumb-item active">Dashboard</span>
        </div>
        <div className="sh-action-buttons">
          <button className="sh-icon-btn settings-btn" onClick={() => navigate('/settings')} title="Settings">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.72 8.93a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/>
            </svg>
            <span>Settings</span>
          </button>
          <button className="sh-icon-btn logout-btn" onClick={handleLogout} title="Logout">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ─────── Header ─────── */}
      <div className="sh-header">
        <div className="sh-welcome">
          <h1>Welcome back, <span className="sh-name-highlight">{firstName}</span></h1>
          <p className="sh-subtitle">Continue your learning journey where you left off</p>
        </div>
        <div className="sh-badges">
          <span className={`sh-badge ${isActive ? 'active' : 'inactive'}`}>
            <span className="sh-badge-dot"></span>
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <span className={`sh-badge ${emailConfirmed ? 'confirmed' : 'unconfirmed'}`}>
            <span className="sh-badge-dot"></span>
            {emailConfirmed ? 'Email Verified' : 'Email Not Verified'}
          </span>
        </div>
      </div>

      {/* ─────── Quick Info Card ─────── */}
      <div className="sh-profile-card">
        <div className="sh-avatar">
          {firstName.charAt(0).toUpperCase()}
        </div>
        <div className="sh-profile-info">
          <h2>{fullName}</h2>
          <p className="sh-role">{roleName}</p>
          <div className="sh-contact-row">
            <span className="sh-contact-item">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="#999" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              {email}
            </span>
            <span className="sh-contact-divider"></span>
            <span className="sh-contact-item">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="#999" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {phoneNumber}
            </span>
          </div>
        </div>
        <div className="sh-profile-actions">
          <button className="sh-refresh-btn" onClick={() => refreshProfile?.()} title="Refresh profile">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#666" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ─────── Stats Grid ─────── */}
      <div className="sh-stats-grid">
        {stats.map((stat, index) => (
          <div className="sh-stat-card" key={stat.label} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="sh-stat-ring">
              <svg viewBox="0 0 36 36" className="sh-stat-ring-svg">
                <path className="sh-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path className="sh-ring-fill" strokeDasharray={`${stat.value * 10}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <span className="sh-stat-value">{stat.value}</span>
            </div>
            <span className="sh-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ─────── My Courses Section ─────── */}
      <div className="sh-section">
        <div className="sh-section-header">
          <h3>
            <svg viewBox="0 0 24 24" width="22" height="22" className="sh-section-icon">
              <path fill="#1e3a5f" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
            </svg>
            My Courses
          </h3>
          <span className="sh-count">{studentCourses.length} courses</span>
        </div>
        {studentCourses.length === 0 ? (
          <div className="sh-empty-state">
            <div className="sh-empty-icon">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="#ddd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p>You are not enrolled in any courses yet.</p>
            <button className="sh-action-btn">Browse Courses</button>
          </div>
        ) : (
          <div className="sh-courses-grid">
            {studentCourses.map((course, idx) => (
              <div className="sh-course-card" key={course?.id || idx}>
                <h4>{course?.courseName || 'Course Name'}</h4>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─────── Recent Activity ─────── */}
      <div className="sh-section">
        <div className="sh-section-header">
          <h3>
            <svg viewBox="0 0 24 24" width="22" height="22" className="sh-section-icon">
              <path fill="#1e3a5f" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            Recent Activity
          </h3>
        </div>
        <div className="sh-empty-state">
          <div className="sh-empty-icon">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <path fill="#ddd" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <p>No recent activity yet.</p>
          <p className="sh-empty-sub">Start learning to see your progress here.</p>
          <button
            type="button"
            className="sh-join-btn"
            onClick={() => window.location.assign('https://edunexus-meeting.vercel.app/lobby')}
          >
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Student_Home;