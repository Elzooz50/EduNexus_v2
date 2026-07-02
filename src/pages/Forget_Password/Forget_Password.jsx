import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forget_password.css';
import logo from '../../assets/icons/Logo.svg';
import forgetPasswordIllustration from '../../assets/images/forget-password-illustration.png';
import axios from 'axios';

const Forget_Password = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBack = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://edunexus.runasp.net/api/Auth/forgot-password',
        email,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const message = response.data?.message || '';

      if (message.toLowerCase().includes('non-existent')) {
        setError(message);
        return;
      }

      setSuccess(message || 'If the email exists, a reset link has been sent to your inbox.');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred. Please try again.'
      );
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forget-container">
      {/* Animated background decoration */}
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>

      <div className="forget-header">
        <button className="back-btn" onClick={handleBack} aria-label="Go Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="header-title">Forget Password</span>
        <div className='right-side'>
          <img src={logo} alt="EduNexus Logo" />
          <span className="brand-name">
            <span className="brand-edu">Edu</span>
            <span className="brand-nexus">Nexus</span>
          </span>
        </div>
      </div>

      <div className="forget-content">
        <div className="forget-card">
          <div className="illustration">
            <img src={forgetPasswordIllustration} alt="Forget Password illustration" />
          </div>

          <h1 className="forget-title">Forget Password</h1>
          <p className="forget-subtitle">
            Please write your email to receive a confirmation code to set a new password.
          </p>

          <form className="forget-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  className="form-input"
                  placeholder="enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
              </div>
            </div>

            {error && (
              <div className="alert alert-error" style={{ color: '#d32f2f', marginTop: '12px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '8px', border: '1px solid rgba(211, 47, 47, 0.15)', fontSize: '0.85rem', fontWeight: 500 }}>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" style={{ color: '#388e3c', marginTop: '12px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '8px', border: '1px solid rgba(56, 142, 60, 0.15)', fontSize: '0.85rem', fontWeight: 500 }}>
                {success}
              </div>
            )}

            <p className="helper-text">
              If the email exists, we will send a reset link to your inbox. You will stay on this page until you open the email link.
            </p>

            <button type="submit" className={`btn-confirm ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? (
                <div className="btn-spinner"></div>
              ) : (
                'Confirm Mail'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forget_Password;