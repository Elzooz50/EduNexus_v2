import React from 'react';
import { useNavigate } from 'react-router-dom';
import './logout.css';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Local cleanup is done in logout service even if API fails.
    await new Promise((resolve) => setTimeout(resolve, 500));
    sessionStorage.clear();
    navigate('/login');
  };

  const handleCancel = () => {
    navigate('/Admin_Dashboard');
  };

  return (
    <div className="logout-container">
      <div className="logout-header">
        <button className="back-btn" onClick={handleCancel}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="header-title">Logout</span>
        <div className='right-side'>
            Edu<p className='logout-word'>Nexus</p>
        </div>
      </div>

      <div className="logout-content">
        <div className="illustration">
            <img src='/src/assets/images/Logout_Cycle.png' alt="Logout illustration" />
        </div>

        <h1 className="logout-title">Are you sure you want to log out?</h1>
        <p className="logout-subtitle">
          You can sign in again anytime, but please make sure your recent activities and changes are saved before continuing
        </p>

        <div className="button-group">
          <button className="btn-cancel" onClick={handleCancel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
            Cancel
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;