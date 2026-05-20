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

      // Check if the response indicates success
      if (response.data.message.includes('sent successfully')) {
        setSuccess(response.data.message);
        // Navigate to verification code page after a brief delay
        setTimeout(() => {
          navigate('/verification-code', { state: { email } });
        }, 1500);
      } else {
        // Non-existent email or other response
        setSuccess('If this email exists in our system, you will receive a password reset link.');
        setTimeout(() => {
          navigate('/verification-code', { state: { email } });
        }, 1500);
      }
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
      <div className="forget-header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="header-title">Forget Password</span>
        <div className='right-side'>

          <img src={logo} alt="" />

          <div>
            <span className="brand-text">Edu</span>
            <span className="brand-highlight">Nexus</span>
          </div>
     
        </div>
      </div>

      <div className="forget-content">
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
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ color: '#d32f2f', marginTop: '12px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ color: '#388e3c', marginTop: '12px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
              {success}
            </div>
          )}

          <button type="submit" className="btn-confirm" disabled={loading}>
            {loading ? 'Sending...' : 'Confirm Mail'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forget_Password;