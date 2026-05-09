import React, { useState, useEffect } from 'react';
import InstAdminSideBar from '../../components/Institutional_Admin_SideBar/Inst_Admin_SideBar';
import './inst_admin_dashboard.css';

const InstAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // All stats default to 0 — will come from backend
  // eslint-disable-next-line no-unused-vars
  const [totalStudents, setTotalStudents] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalCourses, setTotalCourses] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalInstructors, setTotalInstructors] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalRequests, setTotalRequests] = useState(0);

  // Latest students — from backend
  // eslint-disable-next-line no-unused-vars
  const [latestStudents, setLatestStudents] = useState([]);

  // Recent course updates — from backend
  // eslint-disable-next-line no-unused-vars
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    // TODO: Fetch dashboard stats from backend
    // fetch('/api/inst-admin/dashboard-stats')
    //   .then(res => res.json())
    //   .then(data => {
    //     setTotalStudents(data.totalStudents);
    //     setTotalCourses(data.totalCourses);
    //     setTotalInstructors(data.totalInstructors);
    //     setTotalRequests(data.totalRequests);
    //   });

    // TODO: Fetch latest students from backend
    // fetch('/api/inst-admin/latest-students')
    //   .then(res => res.json())
    //   .then(data => setLatestStudents(data));

    // TODO: Fetch recent course updates from backend
    // fetch('/api/inst-admin/recent-courses')
    //   .then(res => res.json())
    //   .then(data => setRecentCourses(data));
  }, []);

  return (
    <div className="ia-layout">
      {/* Mobile toggle */}
      <button className="ia-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      <div className={`ia-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={sidebarOpen ? 'ia-sidebar-wrapper open' : 'ia-sidebar-wrapper'}>
        <InstAdminSideBar />
      </div>

      <main className="ia-main-content">
        {/* Header */}
        <header className="ia-header">
          <div className="ia-header-logo">
            <svg className="ia-edu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="ia-edu-text">Edu<span className="ia-nexus-text">Nexus</span></span>
          </div>
          <div className="ia-user-profile">
            <span className="ia-user-role-label">Institutional Admin</span>
            <div className="ia-user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="ia-page-content">
          {/* Welcome Section */}
          <div className="ia-welcome-section">
            <div className="ia-welcome-text">
              <h1>Welcome back to Your Dashboard</h1>
              <p>Oversee and manage all students, instructors, and courses with precision and professionalism.</p>
            </div>
            <div className="ia-welcome-illustration">
              <svg viewBox="0 0 120 100" fill="none">
                <rect x="10" y="20" width="40" height="50" rx="4" fill="#fef3c7" stroke="#e67e22" strokeWidth="1.5" />
                <rect x="20" y="30" width="20" height="3" rx="1" fill="#e67e22" />
                <rect x="20" y="37" width="15" height="3" rx="1" fill="#e67e22" opacity="0.5" />
                <rect x="20" y="44" width="18" height="3" rx="1" fill="#e67e22" opacity="0.3" />
                <circle cx="85" cy="40" r="20" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
                <path d="M78 40l4 4 8-8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
                <rect x="60" y="60" width="50" height="30" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                <circle cx="75" cy="75" r="8" fill="#3b82f6" opacity="0.2" />
              </svg>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="ia-stats-grid">
            <div className="ia-stat-card">
              <div className="ia-stat-icon-wrap students">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="ia-stat-label">students</span>
              <span className="ia-stat-value">{totalStudents.toLocaleString()}</span>
            </div>

            <div className="ia-stat-card">
              <div className="ia-stat-icon-wrap courses">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span className="ia-stat-label">Courses</span>
              <span className="ia-stat-value">{totalCourses.toLocaleString()}</span>
            </div>

            <div className="ia-stat-card">
              <div className="ia-stat-icon-wrap instructors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="ia-stat-label">Instructor</span>
              <span className="ia-stat-value">{totalInstructors.toLocaleString()}</span>
            </div>

            <div className="ia-stat-card">
              <div className="ia-stat-icon-wrap requests">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <span className="ia-stat-label">Requests</span>
              <span className="ia-stat-value">{totalRequests.toLocaleString()}</span>
            </div>
          </div>

          {/* Latest Students Added */}
          <div className="ia-table-card">
            <h3 className="ia-table-title">Latest Students Added</h3>
            <div className="ia-table-wrapper">
              <table className="ia-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Level</th>
                    <th>Course</th>
                  </tr>
                </thead>
                <tbody>
                  {latestStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="ia-table-empty">No students added yet</td>
                    </tr>
                  ) : (
                    latestStudents.map((student, index) => (
                      <tr key={index}>
                        <td>{student.name}</td>
                        <td>{student.id}</td>
                        <td>{student.level}</td>
                        <td>{student.course}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Course Updates */}
          <div className="ia-table-card">
            <h3 className="ia-table-title">Recent Course Updates</h3>
            <div className="ia-table-wrapper">
              <table className="ia-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Instructor</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCourses.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="ia-table-empty">No course updates yet</td>
                    </tr>
                  ) : (
                    recentCourses.map((course, index) => (
                      <tr key={index}>
                        <td>{course.name}</td>
                        <td>{course.instructor}</td>
                        <td>{course.lastUpdate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstAdminDashboard;
