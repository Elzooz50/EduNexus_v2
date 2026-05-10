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
  const gender = user?.gender === 0 ? 'Male' : user?.gender === 1 ? 'Female' : 'Not specified';

  const studentCourses = user?.studentCourses || [];
  const groups = user?.groups || [];
  const attendances = user?.attendances || [];
  const answerAttempts = user?.answerAttempts || [];

  const stats = [
    { label: 'Enrolled Courses', value: studentCourses.length, icon: '📚' },
    { label: 'My Groups', value: groups.length, icon: '👥' },
    { label: 'Attendance Records', value: attendances.length, icon: '📅' },
    { label: 'Assignments Done', value: answerAttempts.length, icon: '📝' },
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
        <div></div>
        <div className="sh-action-buttons">
          <button className="sh-icon-btn settings-btn" onClick={() => navigate('/settings')} title="Settings">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.72 8.93a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/>
            </svg>
            <span>Settings</span>
          </button>
          <button className="sh-icon-btn logout-btn" onClick={handleLogout} title="Logout">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ─────── Header ─────── */}
      <div className="sh-header">
        <div className="sh-welcome">
          <h1>Welcome back, {firstName}! 👋</h1>
          <p className="sh-subtitle">Let's continue your learning journey today</p>
        </div>
        <div className="sh-badges">
          <span className={`sh-badge ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? '🟢 Active' : '🔴 Inactive'}
          </span>
          <span className={`sh-badge ${emailConfirmed ? 'confirmed' : 'unconfirmed'}`}>
            {emailConfirmed ? '✅ Email Verified' : '⚠️ Email Not Verified'}
          </span>
        </div>
      </div>

      {/* ─────── Quick Info Card ─────── */}
      <div className="sh-profile-card">
        <div className="sh-avatar">{firstName.charAt(0).toUpperCase()}</div>
        <div className="sh-profile-info">
          <h2>{fullName}</h2>
          <p className="sh-role">{roleName}</p>
          <p className="sh-email">{email}</p>
          <p className="sh-phone">{phoneNumber} • {gender}</p>
        </div>
        <button className="sh-refresh-btn" onClick={() => refreshProfile?.()} title="Refresh profile">🔄</button>
      </div>

      {/* ─────── Stats Grid ─────── */}
      <div className="sh-stats-grid">
        {stats.map((stat) => (
          <div className="sh-stat-card" key={stat.label}>
            <span className="sh-stat-icon">{stat.icon}</span>
            <div className="sh-stat-info">
              <span className="sh-stat-value">{stat.value}</span>
              <span className="sh-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─────── My Courses Section ─────── */}
      <div className="sh-section">
        <div className="sh-section-header">
          <h3>📚 My Courses</h3>
          <span className="sh-count">{studentCourses.length} courses</span>
        </div>
        {studentCourses.length === 0 ? (
          <div className="sh-empty-state">
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
          <h3>📋 Recent Activity</h3>
        </div>
        <div className="sh-empty-state">
          <p>No recent activity. Start learning to see your progress here!</p>
        </div>
      </div>
    </div>
  );
};

export default Student_Home;