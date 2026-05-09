import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './new_password.css';

const New_Password = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBack = () => {
    navigate('/verification-code');
  };

  /** @param {React.FormEvent<HTMLFormElement>} e */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('New password set:', newPassword);
    // Handle password reset logic here
    navigate('/login');
  };

  return (
    <div className="password-container">
      <div className="password-header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="header-title">New Password</span>
        <div className='right-side'>
          <img src="/src/assets/icons/Logo.svg" alt="" />
          <div>
            <span className="brand-text">Edu</span>
            <span className="brand-highlight">Nexus</span>
          </div>
        </div>
      </div>

      <div className="password-content">
        <div className="password-icon">
 <img src="/src/assets/icons/dashicons_privacy.png" alt="" />

        </div>

        <h1 className="password-title">New Password</h1>
        <p className="password-subtitle">
          please enter your new password.
        </p>

        <form className="password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your New password</label>
            <div className="input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="enter your email"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="toggle-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-confirm">
            Confirm Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default New_Password;