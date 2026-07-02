import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { fetchAllInstructorCourses, fetchAllInstructorMeetings, fetchAllCourses } from '../../services/instructorService';
import { getAuthToken } from '../../services/authStorage';
import './instructor_home.css';

const Instructor_Home = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user;
  const refreshProfile = authContext?.refreshProfile;
  const logout = authContext?.logout;

  // ─── Profile data ───
  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Instructor';
  const firstName = user?.firstName || 'Instructor';
  const email = user?.email || '';
  const roleName = user?.role?.name || 'Instructor';
  const isActive = user?.isActive ?? true;
  const emailConfirmed = user?.emailConfirmed ?? false;
  const phoneNumber = user?.phoneNumber || 'Not provided';
  const gender = user?.gender === 0 ? 'Male' : user?.gender === 1 ? 'Female' : 'Not specified';

  const courseInstructors = React.useMemo(() => user?.courseInstructors || [], [user?.courseInstructors]);
  const instituteInstructors = React.useMemo(() => user?.instituteInstructors || [], [user?.instituteInstructors]);
  const userMeetings = React.useMemo(() => user?.meetings || [], [user?.meetings]);

  // ─── State ───
  const [courses, setCourses] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [meetingsLoading, setMeetingsLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [meetingsError, setMeetingsError] = useState(null);

  // ─── Fetch data on mount ───
  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      setCoursesLoading(true);
      setCoursesError(null);
      try {
        let data = [];
        if (courseInstructors.length > 0) {
          data = await fetchAllInstructorCourses(courseInstructors);
        } else {
          // Fallback: if no assigned courses, show all available courses so the page has data
          data = await fetchAllCourses();
        }
        if (isMounted) setCourses(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error('Failed to load courses:', err);
        if (isMounted) setCoursesError('Failed to load courses. Please try again.');
      } finally {
        if (isMounted) setCoursesLoading(false);
      }
    };

    const loadMeetings = async () => {
      setMeetingsLoading(true);
      setMeetingsError(null);
      try {
        const data = await fetchAllInstructorMeetings(userMeetings);
        if (isMounted) setMeetings(data);
      } catch (err) {
        console.error('Failed to load meetings:', err);
        if (isMounted) setMeetingsError('Failed to load meetings.');
      } finally {
        if (isMounted) setMeetingsLoading(false);
      }
    };

    loadCourses();
    loadMeetings();

    return () => { isMounted = false; };
  }, [user, courseInstructors, userMeetings]);

  const stats = [
    { label: 'Assigned Courses', value: courseInstructors.length, icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="14" y2="11" /></svg>, color: '#1e3a5f' },
    { label: 'Upcoming Meetings', value: userMeetings.length, icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, color: '#d2691e' },
    { label: 'Institutes', value: instituteInstructors.length, icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>, color: '#027a48' },
  ];

  const handleLogout = async () => {
    try {
      await import('../../services/authService').then(m => m.logoutFromServer());
    } catch {
      // Server logout may fail
    }
    logout?.();
    navigate('/login', { replace: true });
  };

  // ─── Skeleton loaders ───
  const SkeletonCard = () => (
    <div className="ih-skeleton-card">
      <div className="ih-skeleton-bar ih-skeleton-title"></div>
      <div className="ih-skeleton-bar ih-skeleton-subtitle"></div>
      <div className="ih-skeleton-bar ih-skeleton-text"></div>
      <div className="ih-skeleton-row">
        <div className="ih-skeleton-badge"></div>
        <div className="ih-skeleton-badge"></div>
      </div>
    </div>
  );

  const SkeletonMeeting = () => (
    <div className="ih-skeleton-meeting">
      <div className="ih-skeleton-badge" style={{ width: 44, height: 44, borderRadius: 12 }}></div>
      <div style={{ flex: 1 }}>
        <div className="ih-skeleton-bar ih-skeleton-title"></div>
        <div className="ih-skeleton-bar ih-skeleton-text"></div>
      </div>
    </div>
  );

  // ─── Course accent colors ───
  const courseColors = ['#1e3a5f', '#d2691e', '#7c3aed', '#027a48', '#b91c1c', '#0369a1'];

  return (
    <div className="instructor-home">
      {/* Background gradient blobs */}
      <div className="ih-bg-blob blob-1"></div>
      <div className="ih-bg-blob blob-2"></div>

      {/* Top Action Bar */}
      <div className="ih-action-bar">
        <div className="ih-breadcrumb">
          <span className="ih-breadcrumb-item">Home</span>
          <span className="ih-breadcrumb-separator">/</span>
          <span className="ih-breadcrumb-item active">Instructor Dashboard</span>
        </div>
        <div className="ih-action-buttons">
          <button className="ih-icon-btn settings-btn" onClick={() => navigate('/settings')} title="Settings">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Settings</span>
          </button>
          <button className="ih-icon-btn logout-btn" onClick={handleLogout} title="Logout">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="ih-header">
        <div className="ih-welcome">
          <h1>Welcome, Dr. <span className="ih-name-grad">{fullName}</span></h1>
          <p className="ih-subtitle">Manage your courses and meetings</p>
        </div>
        <div className="ih-badges">
          <span className={`ih-badge ${isActive ? 'active' : 'inactive'}`}>
            <span className="ih-badge-dot"></span>
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <span className={`ih-badge ${emailConfirmed ? 'confirmed' : 'unconfirmed'}`}>
            <span className="ih-badge-dot"></span>
            {emailConfirmed ? 'Email Verified' : 'Email Not Verified'}
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="ih-profile-card">
        <div className="ih-avatar">{firstName.charAt(0).toUpperCase()}</div>
        <div className="ih-profile-info">
          <h2>{fullName}</h2>
          <p className="ih-role">{roleName}</p>
          <div className="ih-contact">
            <span className="ih-contact-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#999" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {email}
            </span>
            <span className="ih-contact-divider"></span>
            <span className="ih-contact-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#999" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {phoneNumber}
            </span>
            <span className="ih-contact-divider"></span>
            <span className="ih-contact-item">{gender}</span>
          </div>
        </div>
        <button className="ih-refresh-btn" onClick={() => { refreshProfile?.(); window.location.reload(); }} title="Refresh profile">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#666" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <polyline points="23 20 23 14 17 14" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="ih-stats-grid">
        {stats.map((stat, index) => (
          <div className="ih-stat-card" key={stat.label} style={{ animationDelay: `${0.1 * index}s` }}>
            <div className="ih-stat-icon-wrapper" style={{ color: stat.color }}>{stat.icon}</div>
            <div className="ih-stat-info">
              <span className="ih-stat-value" style={{ color: stat.color }}>{stat.value}</span>
              <span className="ih-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* My Courses Section */}
      <div className="ih-section">
        <div className="ih-section-header">
          <h3>
            <svg viewBox="0 0 24 24" width="22" height="22" className="ih-section-icon" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            {courseInstructors.length > 0 ? 'My Courses' : 'Available Courses'}
          </h3>
          <span className="ih-count">{courses.length} courses</span>
        </div>

        {coursesLoading ? (
          <div className="ih-courses-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : coursesError ? (
          <div className="ih-error-state">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{coursesError}</p>
            <button className="ih-retry-btn" onClick={() => window.location.reload()}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Retry
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="ih-empty-state">
            <div className="ih-empty-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ddd" strokeWidth="1.5">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p>No courses found at the moment.</p>
          </div>
        ) : (
          <div className="ih-courses-grid">
            {courses.map((course, idx) => {
              const accentColor = courseColors[idx % courseColors.length];
              const courseName = course?.courseName || course?.name || 'Untitled Course';
              const courseCode = course?.courseCode || course?.code || '';
              const studentCount = course?.students?.length || course?.studentCourses?.length || 0;
              const description = course?.description || '';

              return (
                <div className="ih-course-card" key={course?.id || course?.courseId || idx}>
                  <div className="ih-course-accent" style={{ background: accentColor }}></div>
                  <div className="ih-course-body">
                    <div className="ih-course-top">
                      {courseCode && <span className="ih-course-code" style={{ color: accentColor, borderColor: accentColor }}>{courseCode}</span>}
                    </div>
                    <h4 className="ih-course-name">{courseName}</h4>
                    {description && <p className="ih-course-desc">{description.length > 80 ? description.slice(0, 80) + '…' : description}</p>}
                    <div className="ih-course-meta">
                      <div className="ih-course-students">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#888" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

      {/* Upcoming Meetings Section */}
      <div className="ih-section">
        <div className="ih-section-header">
          <h3>
            <svg viewBox="0 0 24 24" width="22" height="22" className="ih-section-icon" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            My Meetings
          </h3>
          <span className="ih-count">{userMeetings.length} meetings</span>
        </div>

        {meetingsLoading ? (
          <div className="ih-meetings-list">
            <SkeletonMeeting />
            <SkeletonMeeting />
          </div>
        ) : meetingsError ? (
          <div className="ih-error-state">
            <p>{meetingsError}</p>
            <button className="ih-retry-btn" onClick={() => window.location.reload()}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Retry
            </button>
          </div>
        ) : meetings.length === 0 && userMeetings.length === 0 ? (
          <div className="ih-empty-state">
            <div className="ih-empty-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ddd" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p>No upcoming meetings scheduled.</p>
            <p className="ih-empty-hint">Schedule a meeting to get started.</p>
            <button
              className="ih-schedule-btn"
              onClick={() => {
                const token = getAuthToken();
                window.open(`https://edunexus-meeting.vercel.app/lobby${token ? `?token=${token}` : ''}`, '_blank');
              }}
            >
              Schedule Meeting
            </button>
          </div>
        ) : (
          <div className="ih-meetings-list">
            {(meetings.length > 0 ? meetings : userMeetings).map((meeting, idx) => {
              const title = meeting?.title || meeting?.meetingTitle || `Meeting #${idx + 1}`;
              const status = meeting?.status || meeting?.meetingStatus || 'Unknown';
              const startTime = meeting?.startTime || meeting?.createdAt || meeting?.scheduledAt;
              const isLive = status?.toLowerCase() === 'active' || status?.toLowerCase() === 'inprogress';
              const isEnded = status?.toLowerCase() === 'ended' || status?.toLowerCase() === 'completed';
              const meetingId = meeting?.meetingId || meeting?.id;

              return (
                <div className={`ih-meeting-item ${isLive ? 'live' : ''}`} key={meetingId || idx}>
                  <div className={`ih-meeting-indicator ${isLive ? 'live' : isEnded ? 'ended' : 'scheduled'}`}>
                    {isLive ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    )}
                  </div>
                  <div className="ih-meeting-info">
                    <h4>{title}</h4>
                    <div className="ih-meeting-details">
                      <span className={`ih-meeting-status ${isLive ? 'live' : isEnded ? 'ended' : 'scheduled'}`}>
                        {isLive && <span className="ih-live-dot"></span>}
                        {isLive ? 'Live Now' : isEnded ? 'Ended' : status}
                      </span>
                      {startTime && (
                        <span className="ih-meeting-time">
                          {new Date(startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                  {isLive && meetingId && (
                    <button className="ih-meeting-join-btn" onClick={() => navigate(`/meeting/${meetingId}`)}>
                      Join
                    </button>
                  )}
                </div>
              );
            })}

            {/* Persist the Schedule Meeting button even when meetings exist */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                className="ih-schedule-btn"
                onClick={() => {
                  const token = getAuthToken();
                  window.open(`https://edunexus-meeting.vercel.app/lobby${token ? `?token=${token}` : ''}`, '_blank');
                }}
              >
                Schedule New Meeting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructor_Home;