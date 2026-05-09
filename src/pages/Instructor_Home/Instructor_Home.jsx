// src/pages/Instructor_Home/Instructor_Home.jsx

import React from 'react';
import { useAuth } from '../../context/authContext';
import './instructor_home.css';

const Instructor_Home = () => {
  const authContext = useAuth();
  const user = /** @type {any} */ (authContext?.user);
  const refreshProfile = authContext?.refreshProfile;

  // ──────────────────────────────────
  // Real data from profile API
  // ──────────────────────────────────
  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Instructor';
  const firstName = user?.firstName || 'Instructor';
  const email = user?.email || '';
  const roleName = user?.role?.name || 'Instructor';
  const isActive = user?.isActive ?? true;
  const emailConfirmed = user?.emailConfirmed ?? false;
  const phoneNumber = user?.phoneNumber || 'Not provided';
  const gender = user?.gender === 0 ? 'Male' : user?.gender === 1 ? 'Female' : 'Not specified';

  // Arrays (currently empty — will fill later)
  const courseInstructors = user?.courseInstructors || [];
  const instituteInstructors = user?.instituteInstructors || [];
  const meetings = user?.meetings || [];

  // Ensure unique IDs for map keys
  /** @type {Array<any>} */
  const courseInstructorsWithId = courseInstructors.map((/** @type {any} */ course) => ({
    ...course,
    id: course?.id || `course_${courseInstructors.indexOf(course)}`,
  }));

  /** @type {Array<any>} */
  const meetingsWithId = meetings.map((/** @type {any} */ meeting) => ({
    ...meeting,
    id: meeting?.id || `meeting_${meetings.indexOf(meeting)}`,
  }));

  // Stats
  const stats = [
    { label: 'My Courses', value: courseInstructors.length, icon: '📚' },
    { label: 'Upcoming Meetings', value: meetings.length, icon: '📅' },
    { label: 'Institutes', value: instituteInstructors.length, icon: '🏛️' },
  ];

  return (
    <div className="instructor-home">
      {/* ─────── Header ─────── */}
      <div className="ih-header">
        <div className="ih-welcome">
          <h1>Welcome, Dr. {fullName}! 👋</h1>
          <p className="ih-subtitle">Manage your courses and meetings</p>
        </div>
        <div className="ih-badges">
          <span className={`ih-badge ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? '🟢 Active' : '🔴 Inactive'}
          </span>
          <span className={`ih-badge ${emailConfirmed ? 'confirmed' : 'unconfirmed'}`}>
            {emailConfirmed ? '✅ Email Verified' : '⚠️ Email Not Verified'}
          </span>
        </div>
      </div>

      {/* ─────── Quick Info Card ─────── */}
      <div className="ih-profile-card">
        <div className="ih-avatar">
          {firstName.charAt(0).toUpperCase()}
        </div>
        <div className="ih-profile-info">
          <h2>{fullName}</h2>
          <p className="ih-role">{roleName}</p>
          <p className="ih-email">{email}</p>
          <p className="ih-phone">{phoneNumber} • {gender}</p>
        </div>
        <button className="ih-refresh-btn" onClick={() => refreshProfile?.()} title="Refresh profile">
          🔄
        </button>
      </div>

      {/* ─────── Stats Grid ─────── */}
      <div className="ih-stats-grid">
        {stats.map((stat) => (
          <div className="ih-stat-card" key={stat.label}>
            <span className="ih-stat-icon">{stat.icon}</span>
            <div className="ih-stat-info">
              <span className="ih-stat-value">{stat.value}</span>
              <span className="ih-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─────── My Courses Section ─────── */}
      <div className="ih-section">
        <div className="ih-section-header">
          <h3>📚 My Courses</h3>
          <span className="ih-count">{courseInstructors.length} courses</span>
        </div>
        {courseInstructors.length === 0 ? (
          <div className="ih-empty-state">
            <p>No courses assigned yet.</p>
            <p className="ih-empty-hint">Courses will appear here once assigned by your admin.</p>
          </div>
        ) : (
          <div className="ih-courses-grid">
            {courseInstructorsWithId.map((course) => (
              <div className="ih-course-card" key={course.id}>
                <h4>{course.courseName || 'Course Name'}</h4>
                <p>{course.courseCode || 'Course Code'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─────── Meetings Section ─────── */}
      <div className="ih-section">
        <div className="ih-section-header">
          <h3>📅 Upcoming Meetings</h3>
          <span className="ih-count">{meetings.length} meetings</span>
        </div>
        {meetings.length === 0 ? (
          <div className="ih-empty-state">
            <p>No upcoming meetings scheduled.</p>
            <p className="ih-empty-hint">Schedule a meeting to get started.</p>
            <button className="ih-action-btn">Schedule Meeting</button>
          </div>
        ) : (
          <div className="ih-meetings-list">
            {meetingsWithId.map((meeting) => (
              <div className="ih-meeting-card" key={meeting.id}>
                <h4>{meeting.title || 'Meeting Title'}</h4>
                <p>{meeting.startTime || 'Time TBD'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructor_Home;