import React, { useState, useEffect } from 'react';
import SuperAdminSideBar from '../../components/Super_Admin_SideBar/Super_Admin_SideBar';
import './institutionas.css';

const Institutionas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin name will come from backend
  // eslint-disable-next-line no-unused-vars
  const [adminName, setAdminName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [adminInitials, setAdminInitials] = useState('');

  // Institutions data will come from backend
  // eslint-disable-next-line no-unused-vars
  const [institutions, setInstitutions] = useState([
    // Sample static row for preview
    {
      id: 1,
      name: 'Apex Learning Institute',
      domain: 'apex-learning.com',
      initials: 'AL',
      color: '#4A90A4',
      activeCourses: 130,
      totalMeetings: 70,
    },
  ]);

  useEffect(() => {
    // TODO: Fetch admin info from backend
    // fetch('/api/admin/profile')
    //   .then(res => res.json())
    //   .then(data => {
    //     setAdminName(data.name);
    //     setAdminInitials(data.initials);
    //   });

    // TODO: Fetch institutions from backend
    // fetch('/api/admin/institutions')
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

        {/* Page Content */}
        <div className="sa-page-content">
          <div className="inst-header-section">
            <h1 className="inst-title">Institutions Registry</h1>
            <p className="inst-subtitle">Manage admins, their courses, and overall platform control</p>
          </div>

          <div className="inst-table-card">
            <table className="inst-table">
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
                    <td colSpan={3} className="inst-empty">No institutions found</td>
                  </tr>
                ) : (
                  institutions.map((inst) => (
                    <tr key={inst.id}>
                      <td>
                        <div className="inst-info">
                          <div className="inst-avatar" style={{ backgroundColor: inst.color }}>
                            {inst.initials}
                          </div>
                          <div className="inst-details">
                            <span className="inst-name">{inst.name}</span>
                            <span className="inst-domain">{inst.domain}</span>
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
      </main>
    </div>
  );
};

export default Institutionas;
