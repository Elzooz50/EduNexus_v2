import React, { useState, useEffect, useRef } from 'react';
import SuperAdminSideBar from '../../components/Super_Admin_SideBar/Super_Admin_SideBar';
import apiClient from '../../services/apiClient';
import './super_admin_dashboard.css';

/** Animated counter hook */
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

const SuperAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [usersRes, institutesRes, meetingsRes] = await Promise.all([
          apiClient.get('/Dashboard/users-count'),
          apiClient.get('/Dashboard/institutes-count'),
          apiClient.get('/Dashboard/meetings-count'),
        ]);
        setTotalUsers(Number(usersRes.data) || 0);
        setTotalInstitutions(Number(institutesRes.data) || 0);
        setTotalMeetings(Number(meetingsRes.data) || 0);
        setTimeout(() => setAnimateIn(true), 200);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const usersCount = useCountUp(totalUsers, 1200, animateIn);
  const instCount = useCountUp(totalInstitutions, 1200, animateIn);
  const meetCount = useCountUp(totalMeetings, 1200, animateIn);

  const chartData = [
    { label: 'Users', value: totalUsers, color: '#6366f1', bg: '#eef2ff', icon: '👥' },
    { label: 'Institutions', value: totalInstitutions, color: '#e67e22', bg: '#fef3c7', icon: '🏛️' },
    { label: 'Meetings', value: totalMeetings, color: '#3b82f6', bg: '#dbeafe', icon: '📅' },
  ];

  const maxValue = Math.max(totalUsers, totalInstitutions, totalMeetings, 1);
  const totalSum = totalUsers + totalInstitutions + totalMeetings || 1;

  const adminName = 'Super Administrator';
  const adminInitials = 'SA';

  return (
    <div className="sa-layout">
      <button className="sa-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      <div className={`sa-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={sidebarOpen ? 'sa-sidebar-wrapper open' : 'sa-sidebar-wrapper'}>
        <SuperAdminSideBar />
      </div>

      <main className="sa-main-content">
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
              <span className="sa-user-name">{adminName}</span>
              <span className="sa-user-role">Super Administrator</span>
            </div>
            <div className="sa-user-avatar">{adminInitials}</div>
          </div>
        </header>

        <div className="sa-page-content">
          {loading && (
            <div className="sa-loading">
              <div className="sa-spinner"></div>
              <p>Loading dashboard...</p>
            </div>
          )}

          {error && (
            <div className="sa-error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <div className={`sa-dashboard ${animateIn ? 'sa-animate-in' : ''}`}>
              {/* Stats Cards */}
              <div className="sa-stats-grid">
                <div className="sa-stat-card">
                  <div className="sa-stat-icon-wrapper" style={{ backgroundColor: chartData[0].bg }}>
                    <span className="sa-stat-emoji">{chartData[0].icon}</span>
                  </div>
                  <div className="sa-stat-label">Total Users</div>
                  <div className="sa-stat-value">{usersCount.toLocaleString()}</div>
                  <div className="sa-stat-sub">Registered accounts</div>
                </div>
                <div className="sa-stat-card">
                  <div className="sa-stat-icon-wrapper" style={{ backgroundColor: chartData[1].bg }}>
                    <span className="sa-stat-emoji">{chartData[1].icon}</span>
                  </div>
                  <div className="sa-stat-label">Total Institutions</div>
                  <div className="sa-stat-value">{instCount.toLocaleString()}</div>
                  <div className="sa-stat-sub">Active institutes</div>
                </div>
                <div className="sa-stat-card">
                  <div className="sa-stat-icon-wrapper" style={{ backgroundColor: chartData[2].bg }}>
                    <span className="sa-stat-emoji">{chartData[2].icon}</span>
                  </div>
                  <div className="sa-stat-label">Total Meetings</div>
                  <div className="sa-stat-value">{meetCount.toLocaleString()}</div>
                  <div className="sa-stat-sub">Scheduled sessions</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="sa-charts-row">
                {/* Bar Chart */}
                <div className="sa-chart-card sa-bar-chart-card">
                  <h2 className="sa-chart-title">Overview Comparison</h2>
                  <div className="sa-bar-chart">
                    {chartData.map((item, idx) => (
                      <div className="sa-bar-item" key={item.label} style={{ animationDelay: `${0.2 + idx * 0.15}s` }}>
                        <div className="sa-bar-label">
                          <span>{item.label}</span>
                          <span className="sa-bar-count">{item.value.toLocaleString()}</span>
                        </div>
                        <div className="sa-bar-track">
                          <div
                            className="sa-bar-fill"
                            style={{
                              width: animateIn ? `${(item.value / maxValue) * 100}%` : '0%',
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donut Chart */}
                <div className="sa-chart-card sa-donut-card">
                  <h2 className="sa-chart-title">Distribution</h2>
                  <div className="sa-donut-container">
                    <div
                      className="sa-donut"
                      style={{
                        background: `conic-gradient(
                          #6366f1 0% ${(totalUsers / totalSum) * 100}%,
                          #e67e22 ${(totalUsers / totalSum) * 100}% ${((totalUsers + totalInstitutions) / totalSum) * 100}%,
                          #3b82f6 ${((totalUsers + totalInstitutions) / totalSum) * 100}% 100%
                        )`,
                      }}
                    >
                      <div className="sa-donut-hole">
                        <span className="sa-donut-total">{totalSum.toLocaleString()}</span>
                        <span className="sa-donut-label">Total</span>
                      </div>
                    </div>
                    <div className="sa-donut-legend">
                      {chartData.map((item) => (
                        <div className="sa-legend-item" key={item.label}>
                          <span className="sa-legend-dot" style={{ backgroundColor: item.color }}></span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
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

export default SuperAdminDashboard;