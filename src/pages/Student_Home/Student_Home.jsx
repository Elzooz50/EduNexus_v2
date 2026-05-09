// src/pages/Student_Home/Student_Home.jsx

import React from 'react';
import { useAuth } from '../../context/authContext';
import './student_home.css';

const Student_Home = () => {
  const authContext = useAuth();
  const user = /** @type {any} */ (authContext?.user);
  const refreshProfile = authContext?.refreshProfile;

  // ──────────────────────────────────
  // Real data from profile API
  // ──────────────────────────────────
  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Student';
  const firstName = user?.firstName || 'Student';
  const email = user?.email || '';
  const roleName = user?.role?.name || 'Student';
  const isActive = user?.isActive ?? true;
  const emailConfirmed = user?.emailConfirmed ?? false;
  const phoneNumber = user?.phoneNumber || 'Not provided';
  const gender = user?.gender === 0 ? 'Male' : user?.gender === 1 ? 'Female' : 'Not specified';

  // Arrays (currently empty — will fill later)
  const studentCourses = user?.studentCourses || [];
  const groups = user?.groups || [];
  const attendances = user?.attendances || [];
  const answerAttempts = user?.answerAttempts || [];

  // Generate unique IDs for mapped arrays
  /** @type {Array<any>} */
  const studentCoursesWithId = studentCourses.map((/** @type {any} */ course, /** @type {number} */ idx) => ({
    ...course,
    id: course?.id || `course_${idx}`,
  }));

  // Combined activity for recent activity section
  const recentActivity = [
    ...attendances.map((/** @type {any} */ att) => ({ ...att, type: 'attendance', date: att.date })),
    ...answerAttempts.map((/** @type {any} */ att) => ({ ...att, type: 'assignment', date: att.submittedDate })),
  ].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  // Stats
  const stats = [
    { label: 'Enrolled Courses', value: studentCourses.length, icon: '📚' },
    { label: 'My Groups', value: groups.length, icon: '👥' },
    { label: 'Attendance Records', value: attendances.length, icon: '📅' },
    { label: 'Assignments Done', value: answerAttempts.length, icon: '📝' },
  ];

  return (
    <div className="student-home">
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
        <div className="sh-avatar">
          {firstName.charAt(0).toUpperCase()}
        </div>
        <div className="sh-profile-info">
          <h2>{fullName}</h2>
          <p className="sh-role">{roleName}</p>
          <p className="sh-email">{email}</p>
          <p className="sh-phone">{phoneNumber} • {gender}</p>
        </div>
        <button className="sh-refresh-btn" onClick={() => refreshProfile?.()} title="Refresh profile">
          🔄
        </button>
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
            {studentCoursesWithId.map((course) => (
              <div className="sh-course-card" key={course.id}>
                <h4>{course.courseName || 'Course Name'}</h4>
                <p className="sh-course-code">{course.courseCode || 'Course Code'}</p>
                <p className="sh-course-instructor">{course.instructorName || 'Instructor'}</p>
                <div className="sh-course-progress">
                  <span className="sh-progress-label">Progress</span>
                  <div className="sh-progress-bar">
                    <div className="sh-progress-fill" style={{ width: `${course.progress || 0}%` }}></div>
                  </div>
                  <span className="sh-progress-percent">{course.progress || 0}%</span>
                </div>
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
        {recentActivity.length === 0 ? (
          <div className="sh-empty-state">
            <p>No recent activity. Start learning to see your progress here!</p>
          </div>
        ) : (
          <div className="sh-activity-list">
            {recentActivity.slice(0, 10).map((activity) => (
              <div className="sh-activity-item" key={activity.id}>
                <div className="sh-activity-icon">
                  {activity.type === 'attendance' ? '📅' : '📝'}
                </div>
                <div className="sh-activity-content">
                  <h5>
                    {activity.type === 'attendance' 
                      ? `Attended Class: ${activity.courseName || 'Course'}` 
                      : `Submitted Assignment: ${activity.assignmentName || 'Assignment'}`}
                  </h5>
                  <p className="sh-activity-date">
                    {activity.date 
                      ? new Date(activity.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) 
                      : 'Date unavailable'}
                  </p>
                  {activity.type === 'assignment' && activity.score && (
                    <p className="sh-activity-score">Score: {activity.score}/{activity.totalScore || 100}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Student_Home;