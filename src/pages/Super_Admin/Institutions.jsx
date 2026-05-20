// Institutions.jsx
import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../services/apiClient';
import './institutions.css';
import SuperAdminSideBar from '../../components/Super_Admin_SideBar/Super_Admin_SideBar';

/** Animated counter hook for stats */
const useCountUp = (target, duration = 1000, startCounting = false) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!startCounting || target === 0) {
      setCount(target);
      return;
    }
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, startCounting]);

  return count;
};

const Institutions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [animateIn, setAnimateIn] = useState(false);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  // Stats
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  const [totalUsersAcrossInst, setTotalUsersAcrossInst] = useState(0);
  const [totalMeetingsAcrossInst, setTotalMeetingsAcrossInst] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/Institutes');
        const data = response.data;
        setInstitutions(data);
        
        // Calculate stats
        setTotalInstitutions(data.length);
        const totalUsers = data.reduce((sum, inst) => sum + (inst.userCount || 0), 0);
        const totalMeetings = data.reduce((sum, inst) => sum + (inst.totalMeetings || 0), 0);
        setTotalUsersAcrossInst(totalUsers);
        setTotalMeetingsAcrossInst(totalMeetings);
        
        setTimeout(() => setAnimateIn(true), 200);
      } catch (err) {
        console.error('Error fetching institutions:', err);
        setError('Could not load institutions data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/Institutes');
      const data = response.data;
      setInstitutions(data);
      
      // Calculate stats
      setTotalInstitutions(data.length);
      const totalUsers = data.reduce((sum, inst) => sum + (inst.userCount || 0), 0);
      const totalMeetings = data.reduce((sum, inst) => sum + (inst.totalMeetings || 0), 0);
      setTotalUsersAcrossInst(totalUsers);
      setTotalMeetingsAcrossInst(totalMeetings);
      
      setTimeout(() => setAnimateIn(true), 200);
    } catch (err) {
      console.error('Error fetching institutions:', err);
      setError('Could not load institutions data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted institutions
  const getSortedInstitutions = () => {
    const sortableInst = [...institutions];
    if (sortConfig.key) {
      sortableInst.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle numeric sorting
        if (sortConfig.key === 'userCount' || sortConfig.key === 'totalMeetings') {
          aValue = aValue || 0;
          bValue = bValue || 0;
          if (sortConfig.direction === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        }
        
        // Handle string sorting (name)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (sortConfig.direction === 'asc') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
        
        return 0;
      });
    }
    return sortableInst;
  };

  const sortedInstitutions = getSortedInstitutions();
  
  // Animated stats
  const animatedTotalInst = useCountUp(totalInstitutions, 1000, animateIn);
  const animatedTotalUsers = useCountUp(totalUsersAcrossInst, 1000, animateIn);
  const animatedTotalMeetings = useCountUp(totalMeetingsAcrossInst, 1000, animateIn);

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  // Get header class for sortable column
  const getHeaderClass = (key) => {
    return `inst-sortable-header ${sortConfig.key === key ? 'active' : ''}`;
  };

  const adminName = 'Super Administrator';
  const adminInitials = 'SA';

  return (
    <div className="inst-layout">
      <button className="inst-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      <div className={`inst-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={sidebarOpen ? 'inst-sidebar-wrapper open' : 'inst-sidebar-wrapper'}>
        {/* Your sidebar component */}
        <SuperAdminSideBar />
      </div>

      <main className="inst-main-content">
        <header className="inst-header">
          <div className="inst-header-logo">
            <svg className="inst-edu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="inst-edu-text">Edu<span className="inst-nexus-text">Nexus</span></span>
          </div>
          <div className="inst-user-profile">
            <div className="inst-user-info">
              <span className="inst-user-name">{adminName}</span>
              <span className="inst-user-role">Super Administrator</span>
            </div>
            <div className="inst-user-avatar">{adminInitials}</div>
          </div>
        </header>

        <div className="inst-page-content">
          {loading && (
            <div className="inst-loading">
              <div className="inst-spinner"></div>
              <p>Loading institutions...</p>
            </div>
          )}

          {error && (
            <div className="inst-error">
              <svg className="inst-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>{error}</p>
              <button onClick={() => fetchData()}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <div className={`inst-container ${animateIn ? 'inst-animate-in' : ''}`}>
              {/* Stats Cards */}
              <div className="inst-stats-grid">
                <div className="inst-stat-card">
                  <div className="inst-stat-icon-wrapper">
                    <svg className="inst-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div className="inst-stat-label">Total Institutions</div>
                  <div className="inst-stat-value">{animatedTotalInst.toLocaleString()}</div>
                  <div className="inst-stat-sub">Active institutes</div>
                </div>
                <div className="inst-stat-card">
                  <div className="inst-stat-icon-wrapper">
                    <svg className="inst-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="inst-stat-label">Total Users</div>
                  <div className="inst-stat-value">{animatedTotalUsers.toLocaleString()}</div>
                  <div className="inst-stat-sub">Across all institutes</div>
                </div>
                <div className="inst-stat-card">
                  <div className="inst-stat-icon-wrapper">
                    <svg className="inst-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="inst-stat-label">Total Meetings</div>
                  <div className="inst-stat-value">{animatedTotalMeetings.toLocaleString()}</div>
                  <div className="inst-stat-sub">Scheduled sessions</div>
                </div>
              </div>

              {/* Institutions Table */}
              <div className="inst-table-container">
                <div className="inst-table-header">
                  <h2 className="inst-table-title">Institutions Registry</h2>
                  <div className="inst-table-subtitle">Manage admins, their courses, and overall platform control</div>
                </div>
                
                <div className="inst-table-wrapper">
                  <table className="inst-table">
                    <thead>
                      <tr>
                        <th className={getHeaderClass('name')} onClick={() => requestSort('name')}>
                          <span>Institution Name</span>
                          <span className="inst-sort-icon">{getSortIcon('name')}</span>
                        </th>
                        <th className={getHeaderClass('userCount')} onClick={() => requestSort('userCount')}>
                          <span>Total Users</span>
                          <span className="inst-sort-icon">{getSortIcon('userCount')}</span>
                        </th>
                        <th className={getHeaderClass('totalMeetings')} onClick={() => requestSort('totalMeetings')}>
                          <span>Total Meetings</span>
                          <span className="inst-sort-icon">{getSortIcon('totalMeetings')}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedInstitutions.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="inst-empty-state">
                            <svg className="inst-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <p>No institutions found</p>
                          </td>
                        </tr>
                      ) : (
                        sortedInstitutions.map((institution, index) => (
                          <tr key={institution.id} className="inst-table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td className="inst-cell-name">
                              <div className="inst-name-wrapper">
                                <div className="inst-initials">
                                  {institution.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="inst-name">{institution.name}</div>
                                  <div className="inst-id">{institution.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="inst-cell-users">
                              <div className="inst-users-badge">
                                <svg className="inst-users-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span>{institution.userCount?.toLocaleString() || 0}</span>
                              </div>
                            </td>
                            <td className="inst-cell-meetings">
                              <div className="inst-meetings-badge">
                                <svg className="inst-meetings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                  <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span>{institution.totalMeetings?.toLocaleString() || 0}</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="inst-table-footer">
                  <div className="inst-footer-info">
                    Showing {sortedInstitutions.length} of {institutions.length} institutions
                  </div>
                  <div className="inst-footer-sort-info">
                    <span>Click column headers to sort</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Institutions;