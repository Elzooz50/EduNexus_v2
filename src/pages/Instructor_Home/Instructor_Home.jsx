import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './instructor_home.css';

const Instructor_Home = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user;
  const refreshProfile = authContext?.refreshProfile;
  const logout = authContext?.logout;

  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Instructor';
  const firstName = user?.firstName || 'Instructor';
  const email = user?.email || '';
  const roleName = user?.role?.name || 'Instructor';
  const isActive = user?.isActive ?? true;
  const emailConfirmed = user?.emailConfirmed ?? false;
  const phoneNumber = user?.phoneNumber || 'Not provided';
  const gender = user?.gender === 0 ? 'Male' : user?.gender === 1 ? 'Female' : 'Not specified';

  const courseInstructors = user?.courseInstructors || [];
  const instituteInstructors = user?.instituteInstructors || [];
  const meetings = user?.meetings || [];

  const stats = [
    { label: 'My Courses', value: courseInstructors.length },
    { label: 'Upcoming Meetings', value: meetings.length },
    { label: 'Institutes', value: instituteInstructors.length },
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

  // SVG icons for stats
  const coursesIcon = (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );

  const meetingsIcon = (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const institutesIcon = (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const iconMap = [coursesIcon, meetingsIcon, institutesIcon];

  return (
    <div className="instructor-home">
      {/* Background gradient blobs */}
      <div className="ih-bg-blob blob-1"></div>
      <div className="ih-bg-blob blob-2"></div>

      {/* Top Action Bar - unchanged */}
      <div className="ih-action-bar">
        <div></div>
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
        <button className="ih-refresh-btn" onClick={() => refreshProfile?.()} title="Refresh profile">
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
            <div className="ih-stat-icon-wrapper">{iconMap[index]}</div>
            <div className="ih-stat-info">
              <span className="ih-stat-value">{stat.value}</span>
              <span className="ih-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* My Courses Section */}
      <div className="ih-section">
        <div className="ih-section-header">
          <h3>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            My Courses
          </h3>
          <span className="ih-count">{courseInstructors.length} courses</span>
        </div>
        <div className="ih-empty-state">
          <div className="ih-empty-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ddd" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p>No courses assigned yet.</p>
          <p className="ih-empty-hint">Courses will appear here once assigned by your admin.</p>
        </div>
      </div>

      {/* Meetings Section */}
      <div className="ih-section">
        <div className="ih-section-header">
          <h3>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Upcoming Meetings
          </h3>
          <span className="ih-count">{meetings.length} meetings</span>
        </div>
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
            className="ih-action-btn"
            onClick={() => window.location.assign('https://edunexus-meeting.vercel.app/lobby')}
          >
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructor_Home;