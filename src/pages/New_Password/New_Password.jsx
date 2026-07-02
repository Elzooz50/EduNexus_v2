import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './new_password.css';
import logo from '../../assets/icons/Logo.svg';
import privacyIcon from '../../assets/icons/dashicons_privacy.png';
import axios from 'axios';

const New_Password = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email') || '';
    const tokenParam = params.get('token') || '';

    setEmail(emailParam);
    setToken(tokenParam);

    if (!emailParam || !tokenParam) {
      setError('Reset link is missing email or token. Please open the link from your email again.');
    }
  }, [location.search]);

  const handleBack = () => {
    navigate('/forget-password');
  };

  /** @param {React.FormEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!email || !token) {
      setError('Missing reset token or email. Please open the link from your email again.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'https://edunexus.runasp.net/api/Auth/reset-password',
        {
          email,
          token,
          newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(response.data?.message || 'Password reset successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Invalid reset token or password reset failed. Please request a new reset link.'
      );
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-container">
      {/* Animated background decoration */}
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>

      <div className="password-header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="header-title">New Password</span>
        <div className='right-side'>
          <img src={logo} alt="" />
          <div>
            <span className="brand-text">Edu</span>
            <span className="brand-highlight">Nexus</span>
          </div>
        </div>
      </div>

      <div className="password-content">
        <div className="password-card">
          <div className="illustration">
            <img src={privacyIcon} alt="Privacy icon" />
          </div>

          <h1 className="password-title">New Password</h1>
          <p className="password-subtitle">
            Please enter your new password to secure your account.
          </p>

        {email && (
          <p style={{ marginBottom: '12px', color: '#666', fontSize: '0.95rem' }}>
            Resetting password for: <strong>{email}</strong>
          </p>
        )}

        {error && (
          <div className="alert alert-error" style={{ color: '#d32f2f', marginBottom: '12px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ color: '#388e3c', marginBottom: '12px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
            {success}
          </div>
        )}

        <form className="password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your New password</label>
            <div className="input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button 
                type="button"
                className="toggle-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={loading}
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
                disabled={loading}
              />
              <button 
                type="button"
                className="toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" className={`btn-confirm ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? (
              <div className="btn-spinner"></div>
            ) : (
              'Confirm Password'
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default New_Password;