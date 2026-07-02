// src/pages/Student_Home/Student_Home.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { fetchAllStudentCourses, fetchAllStudentMeetings, fetchAllCourses } from '../../services/studentService';
import { getAuthToken } from '../../services/authStorage';
import './student_home.css';

const Student_Home = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user;
  const refreshProfile = authContext?.refreshProfile;
  const logout = authContext?.logout;

  // ─── Profile data ───
  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Student';
  const firstName = user?.firstName || 'Student';
  const email = user?.email || '';
  const roleName = user?.role?.name || 'Student';
  const isActive = user?.isActive ?? true;
  const emailConfirmed = user?.emailConfirmed ?? false;
  const phoneNumber = user?.phoneNumber || 'Not provided';

  const studentCourses = React.useMemo(() => user?.studentCourses || [], [user?.studentCourses]);
  const groups = React.useMemo(() => user?.groups || [], [user?.groups]);
  const attendances = React.useMemo(() => user?.attendances || [], [user?.attendances]);
  const answerAttempts = React.useMemo(() => user?.answerAttempts || [], [user?.answerAttempts]);
  const userMeetings = React.useMemo(() => user?.meetings || [], [user?.meetings]);

  // ─── State ───
  const [courses, setCourses] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [meetingsLoading, setMeetingsLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [meetingsError, setMeetingsError] = useState(null);

  // ─── Fetch data on mount ───
  const loadCourses = useCallback(async () => {
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      let data = [];
      if (studentCourses.length > 0) {
        data = await fetchAllStudentCourses(studentCourses);
      } else {
        // Fallback: if no enrolled courses, show all available courses so the page has data
        data = await fetchAllCourses();
      }
      setCourses(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setCoursesError('Failed to load your courses. Please try again.');
    } finally {
      setCoursesLoading(false);
    }
  }, [studentCourses]);

  const loadMeetings = useCallback(async () => {
    setMeetingsLoading(true);
    setMeetingsError(null);
    try {
      const data = await fetchAllStudentMeetings(userMeetings);
      setMeetings(data);
    } catch (err) {
      console.error('Failed to load meetings:', err);
      setMeetingsError('Failed to load your meetings.');
    } finally {
      setMeetingsLoading(false);
    }
  }, [userMeetings]);

  useEffect(() => {
    loadCourses();
    loadMeetings();
  }, [loadCourses, loadMeetings]);

  const stats = [
    { label: 'Enrolled Courses', value: studentCourses.length, icon: <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>, color: '#1e3a5f' },
    { label: 'My Groups', value: groups.length, icon: <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>, color: '#d2691e' },
    { label: 'Attendance Records', value: attendances.length, icon: <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>, color: '#027a48' },
    { label: 'Assignments Done', value: answerAttempts.length, icon: <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>, color: '#7c3aed' },
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

  // ─── Skeleton loaders ───
  const SkeletonCard = () => (
    <div className="sh-skeleton-card">
      <div className="sh-skeleton-bar sh-skeleton-title"></div>
      <div className="sh-skeleton-bar sh-skeleton-subtitle"></div>
      <div className="sh-skeleton-bar sh-skeleton-text"></div>
      <div className="sh-skeleton-row">
        <div className="sh-skeleton-badge"></div>
        <div className="sh-skeleton-badge"></div>
      </div>
    </div>
  );

  const SkeletonMeeting = () => (
    <div className="sh-skeleton-meeting">
      <div className="sh-skeleton-badge" style={{ width: 40, height: 40, borderRadius: 10 }}></div>
      <div style={{ flex: 1 }}>
        <div className="sh-skeleton-bar sh-skeleton-title"></div>
        <div className="sh-skeleton-bar sh-skeleton-text"></div>
      </div>
    </div>
  );

  // ─── Course accent colors ───
  const courseColors = ['#1e3a5f', '#d2691e', '#7c3aed', '#027a48', '#b91c1c', '#0369a1'];

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
          <button className="sh-refresh-btn" onClick={() => { refreshProfile?.(); loadCourses(); loadMeetings(); }} title="Refresh profile">
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
            <div className="sh-stat-emoji">{stat.icon}</div>
            <div className="sh-stat-info">
              <span className="sh-stat-value" style={{ color: stat.color }}>{stat.value}</span>
              <span className="sh-stat-label">{stat.label}</span>
            </div>
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
            {studentCourses.length > 0 ? 'My Courses' : 'Available Courses'}
          </h3>
          <span className="sh-count">{courses.length} courses</span>
        </div>

        {coursesLoading ? (
          <div className="sh-courses-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : coursesError ? (
          <div className="sh-error-state">
            <svg viewBox="0 0 24 24" width="40" height="40">
              <path fill="#ef4444" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>{coursesError}</p>
            <button className="sh-retry-btn" onClick={loadCourses}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              Retry
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="sh-empty-state">
            <div className="sh-empty-icon">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="#ddd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p>No courses found at the moment.</p>
          </div>
        ) : (
          <div className="sh-courses-grid">
            {courses.map((course, idx) => {
              const accentColor = courseColors[idx % courseColors.length];
              const courseName = course?.courseName || course?.name || 'Untitled Course';
              const courseCode = course?.courseCode || course?.code || '';
              const studentCount = course?.students?.length || course?.studentCourses?.length || 0;
              const instructors = course?.instructors || course?.courseInstructors || [];
              const description = course?.description || '';

              return (
                <div className="sh-course-card" key={course?.id || course?.courseId || idx}>
                  <div className="sh-course-accent" style={{ background: accentColor }}></div>
                  <div className="sh-course-body">
                    <div className="sh-course-top">
                      {courseCode && <span className="sh-course-code" style={{ color: accentColor, borderColor: accentColor }}>{courseCode}</span>}
                    </div>
                    <h4 className="sh-course-name">{courseName}</h4>
                    {description && <p className="sh-course-desc">{description.length > 80 ? description.slice(0, 80) + '…' : description}</p>}
                    <div className="sh-course-meta">
                      {instructors.length > 0 && (
                        <div className="sh-course-instructors">
                          <svg viewBox="0 0 24 24" width="14" height="14">
                            <path fill="#888" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <span>
                            {instructors.slice(0, 2).map((inst, i) => {
                              const name = inst?.fullName || inst?.instructorName || inst?.firstName || 'Instructor';
                              return <span key={i}>{name}{i < Math.min(instructors.length, 2) - 1 ? ', ' : ''}</span>;
                            })}
                            {instructors.length > 2 && <span className="sh-more-count">+{instructors.length - 2}</span>}
                          </span>
                        </div>
                      )}
                      <div className="sh-course-students">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                          <path fill="#888" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                        <span>{studentCount} students</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─────── My Meetings ─────── */}
      <div className="sh-section">
        <div className="sh-section-header">
          <h3>
            <svg viewBox="0 0 24 24" width="22" height="22" className="sh-section-icon">
              <path fill="#1e3a5f" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
            My Meetings
          </h3>
          <span className="sh-count">{userMeetings.length} meetings</span>
        </div>

        {meetingsLoading ? (
          <div className="sh-meetings-list">
            <SkeletonMeeting />
            <SkeletonMeeting />
          </div>
        ) : meetingsError ? (
          <div className="sh-error-state">
            <p>{meetingsError}</p>
            <button className="sh-retry-btn" onClick={loadMeetings}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              Retry
            </button>
          </div>
        ) : meetings.length === 0 && userMeetings.length === 0 ? (
          <div className="sh-empty-state">
            <div className="sh-empty-icon">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="#ddd" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>
            <p>No meetings scheduled yet.</p>
            <p className="sh-empty-sub">Your upcoming meetings will appear here.</p>
          </div>
        ) : (
          <div className="sh-meetings-list">
            {(meetings.length > 0 ? meetings : userMeetings).map((meeting, idx) => {
              const title = meeting?.title || meeting?.meetingTitle || `Meeting #${idx + 1}`;
              const status = meeting?.status || meeting?.meetingStatus || 'Unknown';
              const startTime = meeting?.startTime || meeting?.createdAt || meeting?.scheduledAt;
              const isLive = status?.toLowerCase() === 'active' || status?.toLowerCase() === 'inprogress';
              const isEnded = status?.toLowerCase() === 'ended' || status?.toLowerCase() === 'completed';
              const meetingId = meeting?.meetingId || meeting?.id;

              return (
                <div className={`sh-meeting-item ${isLive ? 'live' : ''}`} key={meetingId || idx}>
                  <div className={`sh-meeting-indicator ${isLive ? 'live' : isEnded ? 'ended' : 'scheduled'}`}>
                    {isLive ? (
                      <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#fff" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#fff" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                    )}
                  </div>
                  <div className="sh-meeting-info">
                    <h4>{title}</h4>
                    <div className="sh-meeting-details">
                      <span className={`sh-meeting-status ${isLive ? 'live' : isEnded ? 'ended' : 'scheduled'}`}>
                        {isLive && <span className="sh-live-dot"></span>}
                        {isLive ? 'Live Now' : isEnded ? 'Ended' : status}
                      </span>
                      {startTime && (
                        <span className="sh-meeting-time">
                          {new Date(startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                  {isLive && meetingId && (
                    <button className="sh-meeting-join-btn" onClick={() => navigate(`/meeting/${meetingId}`)}>
                      Join
                    </button>
                  )}
                </div>
              );
            })}
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
            onClick={() => {
              const token = getAuthToken();
              // Using localhost so you can see the new AuthContext token parsing work dynamically!
              window.open(`http://localhost:5173/lobby${token ? `?token=${token}` : ''}`, '_blank');
            }}
          >
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Student_Home;