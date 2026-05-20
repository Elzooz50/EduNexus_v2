import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forget_password.css';
import logo from '../../assets/icons/Logo.svg';
import forgetPasswordIllustration from '../../assets/images/forget-password-illustration.png';

const Forget_Password = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleBack = () => {
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle confirm mail logic here
    console.log('Email submitted:', email);
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
              />
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
          </div>

          <button type="submit" className="btn-confirm">
            Confirm Mail
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forget_Password;