import React, { useState, useEffect } from 'react';
import SuperAdminSideBar from '../../components/Super_Admin_SideBar/Super_Admin_SideBar';
import './user_access.css';
import './super_admin_dashboard.css';

import { getApiErrorMessage } from '../../services/apiClient';

// TODO: Import these from the actual API service
/**
 * @returns {Promise<any[]>}
 */
const getPendingInstituteRequests = async () => [];

/**
 * @param {any} id
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-unused-vars
const acceptInstituteRequest = async (id) => {};

/**
 * @param {any} id
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-unused-vars
const rejectInstituteRequest = async (id) => {};

const UserAccess = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin name will come from backend
  // eslint-disable-next-line no-unused-vars
  const [adminName, setAdminName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [adminInitials, setAdminInitials] = useState('');

  // Pending signup requests will come from backend
  const [pendingRequests, setPendingRequests] = useState(/** @type {any[]} */ ([]));
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  /**
   * @param {any} request
   * @param {number} index
   */
  const mapPendingRequest = (request, index) => {
    const institutionName = request?.instituteName || request?.institutionName || request?.name || `Institute ${index + 1}`;
    const id = request?.id ?? request?.requestId ?? index;

    const initials = institutionName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((/** @type {string} */ word) => word[0])
      .join('')
      .toUpperCase();

    return {
      ...request,
      id,
      institutionName,
      initials: initials || '--',
      color: request?.color || '#7C3AED',
      adminName: request?.adminName || request?.createdBy || 'Pending Contact',
      email: request?.email || request?.insEmail || request?.contactEmail || 'No email provided',
      location: request?.location || request?.address || 'Location not provided',
      appliedDate: request?.createdAt ? `Applied ${new Date(request.createdAt).toLocaleDateString()}` : 'Applied recently',
    };
  };

  const fetchPendingRequests = async () => {
    setErrorMessage('');
    setIsLoadingRequests(true);

    try {
      const data = await getPendingInstituteRequests();
      setPendingRequests(data.map(mapPendingRequest));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Failed to load pending requests.'));
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    // TODO: Fetch admin info from backend
    // fetch('/api/admin/profile')
    //   .then(res => res.json())
    //   .then(data => {
    //     setAdminName(data.name);
    //     setAdminInitials(data.initials);
    //   });

    fetchPendingRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * @param {any} id
   */
  const handleApprove = async (id) => {
    setActionMessage('');
    setErrorMessage('');

    try {
      await acceptInstituteRequest(id);
      setPendingRequests((prev) => prev.filter((req) => req.id !== id));
      setActionMessage('Request approved successfully.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Failed to approve request.'));
    }
  };

  /**
   * @param {any} id
   */
  const handleDeny = async (id) => {
    setActionMessage('');
    setErrorMessage('');

    try {
      await rejectInstituteRequest(id);
      setPendingRequests((prev) => prev.filter((req) => req.id !== id));
      setActionMessage('Request rejected successfully.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Failed to reject request.'));
    }
  };

  /**
   * @param {string} name
   */
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map((/** @type {string} */ n) => n[0]).join('').toUpperCase();
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
          <div className="ua-header-section">
            <h1 className="ua-title">Pending Signups</h1>
            <p className="ua-subtitle">Review and verify educational partners awaiting platform access.</p>
          </div>

          <div className="ua-requests-list">
            {isLoadingRequests && <div className="ua-notice">Loading pending requests...</div>}
            {errorMessage && <div className="ua-notice ua-notice-error">{errorMessage}</div>}
            {actionMessage && <div className="ua-notice ua-notice-success">{actionMessage}</div>}

            {pendingRequests.length === 0 ? (
              <div className="ua-empty">
                <p>No pending signup requests at this time.</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div className="ua-request-card" key={request.id}>
                  <div className="ua-request-left">
                    <div className="ua-request-avatar" style={{ backgroundColor: request.color }}>
                      {request.initials}
                    </div>
                    <div className="ua-request-info">
                      <h3 className="ua-request-name">{request.institutionName}</h3>
                      <div className="ua-request-details">
                        <span className="ua-detail">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          {request.adminName}
                        </span>
                        <span className="ua-detail">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          {request.email}
                        </span>
                      </div>
                      <div className="ua-request-details">
                        <span className="ua-detail">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {request.location}
                        </span>
                        <span className="ua-detail">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {request.appliedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ua-request-actions">
                    <button className="ua-btn ua-btn-approve" onClick={() => handleApprove(request.id)}>
                      Approve Access
                    </button>
                    <button className="ua-btn ua-btn-deny" onClick={() => handleDeny(request.id)}>
                      Deny Access
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Verification Policy */}
          <div className="ua-policy-card">
            <h3 className="ua-policy-title">Verification Policy</h3>
            <div className="ua-policy-content">
              <svg className="ua-policy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p>All institutions must have a verified academic domain and a valid physical address. Verification scores below 80 require manual background checks by the security team.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserAccess;
