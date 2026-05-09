// src/pages/Login/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import RoleBasedRedirect from '../../components/RoleBasedRedirect';
import { useAuth } from '../../context/AuthContext.jsx';
import { getApiErrorMessage } from '../../services/apiClient';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(/** @type {'email' | 'ssn' | null} */ (null));

  /**
   * @param {string} value
   * @returns {'email' | 'ssn' | null}
   */
  const detectInputType = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.includes('@')) {
      return 'email';
    }
    if (/\d/.test(trimmed)) {
      return 'ssn';
    }
    return null;
  };

  /**
   * @param {any} event
   */
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === 'identifier') {
      setInputType(detectInputType(value));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * @param {any} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const trimmedIdentifier = formData.identifier.trim();

    if (!trimmedIdentifier || !formData.password.trim()) {
      setErrorMessage('Email/SSN and password are required.');
      return;
    }

    const detectedType = detectInputType(trimmedIdentifier);
    if (detectedType === 'ssn') {
      const normalizedSsn = trimmedIdentifier.replace(/\D/g, '');
      if (normalizedSsn.length !== 14) {
        setErrorMessage('SSN must be exactly 14 digits.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const result = await login({
        ssnOrEmail: trimmedIdentifier,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      navigate(result.redirectPath, { replace: true });
    } catch (error) {
      const authError = /** @type {any} */ (error);
      if (authError?.response?.status === 409) {
        setErrorMessage('Your account is pending approval or has a conflict. Please contact admin.');
      } else {
        setErrorMessage(getApiErrorMessage(authError, 'Login failed. Please check your credentials.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Redirect if already logged in */}
      <RoleBasedRedirect />

      <div className="login-container">
        <div className="login-left">
          <div className="left-content">
            <h1 className="left-title">
              Step in and start<br />
              your <span className="highlight">next</span> meeting<br />
              — wherever you are.
            </h1>
            <div className="illustration">
              <img
                src="/src/assets/images/Login-Remote-Meeting.png"
                alt="Video conference illustration"
                className="meeting-illustration"
              />
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <div className="logo-wrapper">
              <img
                src="/src/assets/icons/Logo.svg"
                alt="EduNexus Logo"
                className="logo"
              />
            </div>

            <div className="welcome-text">
              <p className="welcome-back">Welcome back to</p>
              <h2 className="platform-title">
                <span className="edu">EduNexus</span>{' '}
                <span className="platform">Platform</span>
              </h2>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="identifier">
                  {inputType === 'email' ? 'Your Email' : 'Your Email or SSN'}
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    placeholder="Enter your email or SSN"
                    className="form-input"
                    autoComplete="username"
                  />
                  <span className="input-icon user-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#999" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </span>
                  {inputType === 'ssn' && formData.identifier && (
                    <span className="input-type-badge">SSN</span>
                  )}
                  {inputType === 'email' && formData.identifier && (
                    <span className="input-type-badge email-badge">Email</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Your Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="form-input"
                    autoComplete="current-password"
                  />
                  <span
                    className="input-icon eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      {showPassword ? (
                        <path fill="#999" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      ) : (
                        <path fill="#999" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      )}
                    </svg>
                  </span>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    className="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  <span className="remember-text">Remember me</span>
                </label>
                <Link to="/forget-password" className="forgot-password">Forget password?</Link>
              </div>

              {errorMessage && <p className="form-message form-message-error">{errorMessage}</p>}

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? (
                  <span className="button-loading">
                    <span className="spinner"></span>
                    LOGGING IN...
                  </span>
                ) : (
                  'LOGIN NOW'
                )}
              </button>

              <div className="signup-link-wrap">
                Don't have an account? <Link to="/sign-up" className="signup-link">Sign up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;