import React, { useState, useEffect } from 'react';
import SuperAdminSideBar from '../../components/Super_Admin_SideBar/Super_Admin_SideBar';
import './super_admin_dashboard.css';

const SuperAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // All data comes from backend - defaults to 0
  // eslint-disable-next-line no-unused-vars
  const [totalUsers, setTotalUsers] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalMeetings, setTotalMeetings] = useState(0);

  // Admin name from backend
  // eslint-disable-next-line no-unused-vars
  const [adminName, setAdminName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [adminInitials, setAdminInitials] = useState('');

  // Top institutions from backend
  // eslint-disable-next-line no-unused-vars
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    // TODO: Fetch dashboard stats from backend
    // fetch('/api/admin/dashboard-stats')
    //   .then(res => res.json())
    //   .then(data => {
    //     setTotalUsers(data.totalUsers);
    //     setTotalInstitutions(data.totalInstitutions);
    //     setTotalMeetings(data.totalMeetings);
    //   });

    // TODO: Fetch admin profile from backend
    // fetch('/api/admin/profile')
    //   .then(res => res.json())
    //   .then(data => {
    //     setAdminName(data.name);
    //     setAdminInitials(data.initials);
    //   });

    // TODO: Fetch top institutions from backend
    // fetch('/api/admin/top-institutions')
    //   .then(res => res.json())
    //   .then(data => setInstitutions(data));
  }, []);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="sa-layout">
      {/* Mobile toggle */}
      <button className="sa-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      <div className={`sa-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={sidebarOpen ? 'sa-sidebar-wrapper open' : 'sa-sidebar-wrapper'}>
        <SuperAdminSideBar />
      </div>

      <main className="sa-main-content">
        {/* Header */}
        <header className="sa-header">
          <div className="sa-header-logo">
            <svg className="sa-edu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="sa-edu-text">Edu<span className="sa-nexus-text">Nexus</span></span>
          </div>
          <div className="sa-user-profile">
            <div className="sa-user-info">
              <span className="sa-user-name">{adminName || 'Loading...'}</span>
              <span className="sa-user-role">Super Administrator</span>
            </div>
            <div className="sa-user-avatar">{adminInitials || getInitials(adminName) || '--'}</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="sa-page-content">
          {/* Stats Cards */}
          <div className="sa-stats-grid">
            <div className="sa-stat-card">
              <div className="sa-stat-header">
                <svg className="sa-stat-icon users" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="sa-stat-label">Total Users</div>
              <div className="sa-stat-value">{totalUsers.toLocaleString()}</div>
            </div>

            <div className="sa-stat-card">
              <div className="sa-stat-header">
                <svg className="sa-stat-icon institutions" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="sa-stat-label">Total Institutions</div>
              <div className="sa-stat-value">{totalInstitutions.toLocaleString()}</div>
            </div>

            <div className="sa-stat-card">
              <div className="sa-stat-header">
                <svg className="sa-stat-icon meetings" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="sa-stat-label">Total Meetings</div>
              <div className="sa-stat-value">{totalMeetings.toLocaleString()}</div>
            </div>
          </div>

          {/* Top Institutions Table */}
          <div className="sa-table-card">
            <h3 className="sa-table-title">Top Institutions</h3>
            <div className="sa-table-wrapper">
              <table className="sa-institutions-table">
                <thead>
                  <tr>
                    <th>Institutions Name</th>
                    <th>Active Courses</th>
                    <th>Total Meetings</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="sa-table-empty">No institutions data yet</td>
                    </tr>
                  ) : (
                    institutions.map((inst) => (
                      <tr key={inst.id}>
                        <td>
                          <div className="sa-institution-info">
                            <div className="sa-institution-avatar" style={{ backgroundColor: inst.color }}>
                              {inst.initials}
                            </div>
                            <div className="sa-institution-details">
                              <span className="sa-institution-name">{inst.name}</span>
                              <span className="sa-institution-domain">{inst.domain}</span>
                            </div>
                          </div>
                        </td>
                        <td>{inst.activeCourses}</td>
                        <td>{inst.totalMeetings}</td>
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

export default SuperAdminDashboard;