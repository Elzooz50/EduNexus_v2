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
      <RoleBasedRedirect />

      <div className="login-wrapper">
        {/* Animated background elements – now 7 balls */}
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
          <div className="shape shape-7"></div>
        </div>

        {/* Floating particles */}
        <div className="particles">
          <span className="particle" style={{ '--x': '10%', '--y': '20%', '--duration': '6s' }}></span>
          <span className="particle" style={{ '--x': '80%', '--y': '70%', '--duration': '8s' }}></span>
          <span className="particle" style={{ '--x': '30%', '--y': '80%', '--duration': '7s' }}></span>
          <span className="particle" style={{ '--x': '70%', '--y': '15%', '--duration': '9s' }}></span>
          <span className="particle" style={{ '--x': '90%', '--y': '40%', '--duration': '5s' }}></span>
          <span className="particle" style={{ '--x': '15%', '--y': '60%', '--duration': '10s' }}></span>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h1 className="brand-title">
              Edu<span className="brand-accent">Nexus</span>
            </h1>
            <p className="welcome-message">Welcome back! Please sign in to continue.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Identifier – no icon */}
            <div className="form-group">
              <label htmlFor="identifier">
                {inputType === 'email' ? 'Email Address' : 'Email or SSN'}
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder="you@example.com or SSN"
                  className="form-input"
                  autoComplete="username"
                />
                {inputType === 'ssn' && formData.identifier && (
                  <span className="input-badge">SSN</span>
                )}
                {inputType === 'email' && formData.identifier && (
                  <span className="input-badge email">Email</span>
                )}
              </div>
            </div>

            {/* Password – no icon, eye toggle stays */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
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
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#999" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#999" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forget-password" className="forgot-link">Forgot password?</Link>
            </div>

            {errorMessage && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#b42318" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {errorMessage}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="signup-text">
              Don't have an account? <Link to="/sign-up" className="signup-link">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;