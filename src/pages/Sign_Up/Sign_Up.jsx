import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sign_up.css';
import apiClient, { getApiErrorMessage } from '../../services/apiClient';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ssn: '',
    firstName: '',
    lastName: '',
    phoneNumber: '+20 ',
    email: '',
    gender: '0',
    password: '',
    confirmPassword: '',
    roleId: '4',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * @param {any} event
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Phone number: keep +20 prefix, only allow digits after
    if (name === 'phoneNumber') {
      const prefix = '+20 ';
      if (!value.startsWith(prefix)) {
        setFormData((prev) => ({ ...prev, phoneNumber: prefix }));
        return;
      }
      const afterPrefix = value.slice(prefix.length).replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        phoneNumber: prefix + afterPrefix,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorMessage) setErrorMessage('');
  };

  /**
   * @param {string} value
   * @returns {string}
   */
  const formatSSN = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}-${digits.slice(11)}`;
  };

  /**
   * @param {any} event
   */
  const handleSSNChange = (event) => {
    const formatted = formatSSN(event.target.value);
    setFormData((prev) => ({
      ...prev,
      ssn: formatted,
    }));
    if (fieldErrors.ssn) {
      setFieldErrors((prev) => ({ ...prev, ssn: '' }));
    }
  };

  /**
   * @param {any} error
   * @returns {{ fieldErrors: Record<string, string>, generalMessage: string }}
   */
  const parseServerError = (error) => {
    const message = getApiErrorMessage(error, '');
    const lowerMsg = message.toLowerCase();
    /** @type {Record<string, string>} */
    const errors = {};

    if (lowerMsg.includes('ssn') && (lowerMsg.includes('exist') || lowerMsg.includes('duplicate') || lowerMsg.includes('already') || lowerMsg.includes('taken'))) {
      errors.ssn = 'This SSN is already registered.';
    }
    if (lowerMsg.includes('email') && (lowerMsg.includes('exist') || lowerMsg.includes('duplicate') || lowerMsg.includes('already') || lowerMsg.includes('taken'))) {
      errors.email = 'This email is already registered.';
    }
    if (lowerMsg.includes('phone') && (lowerMsg.includes('exist') || lowerMsg.includes('duplicate') || lowerMsg.includes('already') || lowerMsg.includes('taken'))) {
      errors.phoneNumber = 'This phone number is already registered.';
    }

    if (Object.keys(errors).length > 0) {
      return { fieldErrors: errors, generalMessage: 'Some fields are already in use.' };
    }

    return { fieldErrors: {}, generalMessage: message || 'Registration failed. Please try again.' };
  };

  /**
   * @param {any} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});

    const trimmedData = {
      ssn: formData.ssn.replace(/\D/g, ''),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      gender: formData.gender,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      roleId: formData.roleId,
    };

    // Required fields
    if (!trimmedData.ssn || !trimmedData.firstName || !trimmedData.lastName ||
        trimmedData.phoneNumber === '+20' || !trimmedData.email || !trimmedData.password ||
        !trimmedData.confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    // SSN: 14 digits
    if (trimmedData.ssn.length !== 14) {
      setFieldErrors((prev) => ({ ...prev, ssn: 'SSN must be exactly 14 digits.' }));
      return;
    }

    // Names: letters only
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/;
    if (!nameRegex.test(trimmedData.firstName)) {
      setFieldErrors((prev) => ({ ...prev, firstName: 'First name must contain letters only.' }));
      return;
    }
    if (!nameRegex.test(trimmedData.lastName)) {
      setFieldErrors((prev) => ({ ...prev, lastName: 'Last name must contain letters only.' }));
      return;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
      return;
    }

    // Phone: +20 + exactly 10 digits
    const phoneDigits = trimmedData.phoneNumber.replace('+20', '').replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setFieldErrors((prev) => ({ ...prev, phoneNumber: 'Phone number must be 10 digits after +20.' }));
      return;
    }

    // Password strength
    if (trimmedData.password.length < 8) {
      setFieldErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters.' }));
      return;
    }
    if (!/[A-Z]/.test(trimmedData.password)) {
      setFieldErrors((prev) => ({ ...prev, password: 'Password must contain at least 1 uppercase letter.' }));
      return;
    }
    if (!/[a-z]/.test(trimmedData.password)) {
      setFieldErrors((prev) => ({ ...prev, password: 'Password must contain at least 1 lowercase letter.' }));
      return;
    }
    if (!/[0-9]/.test(trimmedData.password)) {
      setFieldErrors((prev) => ({ ...prev, password: 'Password must contain at least 1 number.' }));
      return;
    }
    if (/[^a-zA-Z0-9]/.test(trimmedData.password)) {
      setFieldErrors((prev) => ({ ...prev, password: 'Password must contain only letters and numbers (no special characters).' }));
      return;
    }

    // Confirm password
    if (trimmedData.password !== trimmedData.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/Auth/register', {
        ssn: trimmedData.ssn,
        firstName: trimmedData.firstName,
        lastName: trimmedData.lastName,
        phoneNumber: trimmedData.phoneNumber,
        email: trimmedData.email,
        insEmail: trimmedData.email,
        gender: trimmedData.gender,
        password: trimmedData.password,
        confirmPassword: trimmedData.confirmPassword,
        roleId: trimmedData.roleId,
      });

      if (response.data.success) {
        setSuccessMessage('Registration successful! Redirecting to login...');

        setFormData({
          ssn: '',
          firstName: '',
          lastName: '',
          phoneNumber: '+20 ',
          email: '',
          gender: '0',
          password: '',
          confirmPassword: '',
          roleId: '4',
        });

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } else {
        setErrorMessage(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      const { fieldErrors: serverFieldErrors, generalMessage } = parseServerError(error);

      if (Object.keys(serverFieldErrors).length > 0) {
        setFieldErrors(serverFieldErrors);
        setErrorMessage(generalMessage);
      } else {
        setErrorMessage(generalMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="left-content">
          <h1 className="left-title">
            Join EduNexus and<br />
            start your <span className="highlight">learning</span><br />
            journey today!
          </h1>
          <div className="illustration">
            <img
              src="/src/assets/images/Login-Remote-Meeting.png"
              alt="Online learning illustration"
              className="learning-illustration"
            />
          </div>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-form-container">
          <div className="logo-wrapper">
            <img
              src="/src/assets/icons/Logo.svg"
              alt="EduNexus Logo"
              className="logo"
            />
          </div>

          <div className="welcome-text">
            <p className="welcome-back">Join us today at</p>
            <h2 className="platform-title">
              <span className="edu">EduNexus</span>{' '}
              <span className="platform">Platform</span>
            </h2>
          </div>

          <form className="signup-form" onSubmit={handleSubmit} noValidate>

            {/* SSN */}
            <div className="form-group">
              <label htmlFor="ssn">SSN (14 digits)</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="ssn"
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleSSNChange}
                  placeholder="XXX-XXXX-XXXX-XX"
                  className={`form-input ${fieldErrors.ssn ? 'input-error' : ''}`}
                  maxLength={17}
                  required
                />
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#999" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-10h2v8h-2V7z"/>
                  </svg>
                </span>
              </div>
              {fieldErrors.ssn && <span className="field-error">{fieldErrors.ssn}</span>}
            </div>

            {/* First Name + Last Name */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Your first name"
                    className={`form-input ${fieldErrors.firstName ? 'input-error' : ''}`}
                    required
                  />
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#999" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </span>
                </div>
                {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Your last name"
                    className={`form-input ${fieldErrors.lastName ? 'input-error' : ''}`}
                    required
                  />
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#999" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </span>
                </div>
                {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+20 1XX XXX XXXX"
                  className={`form-input ${fieldErrors.phoneNumber ? 'input-error' : ''}`}
                  required
                />
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#999" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </span>
              </div>
              {fieldErrors.phoneNumber && <span className="field-error">{fieldErrors.phoneNumber}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="yourname@example.com"
                  className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                  required
                />
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#999" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </span>
              </div>
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>Gender</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="0"
                    checked={formData.gender === '0'}
                    onChange={handleInputChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Male</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="1"
                    checked={formData.gender === '1'}
                    onChange={handleInputChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Female</span>
                </label>
              </div>
            </div>

            {/* Role */}
            <div className="form-group">
              <label>Role</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="roleId"
                    value="4"
                    checked={formData.roleId === '4'}
                    onChange={handleInputChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Student</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="roleId"
                    value="3"
                    checked={formData.roleId === '3'}
                    onChange={handleInputChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Instructor</span>
                </label>
              </div>
            </div>

            {/* Password + Confirm Password */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min. 8 chars, A-Z, a-z, 0-9"
                    className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                    required
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
                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                {formData.password && !fieldErrors.password && (
                  <div className="password-strength">
                    <span className={`strength-rule ${formData.password.length >= 8 ? 'passed' : ''}`}>
                      ✓ 8+ characters
                    </span>
                    <span className={`strength-rule ${/[A-Z]/.test(formData.password) ? 'passed' : ''}`}>
                      ✓ Uppercase letter
                    </span>
                    <span className={`strength-rule ${/[a-z]/.test(formData.password) ? 'passed' : ''}`}>
                      ✓ Lowercase letter
                    </span>
                    <span className={`strength-rule ${/[0-9]/.test(formData.password) ? 'passed' : ''}`}>
                      ✓ Number
                    </span>
                    <span className={`strength-rule ${!/[^a-zA-Z0-9]/.test(formData.password) ? 'passed' : ''}`}>
                      ✓ No special characters
                    </span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter password"
                    className={`form-input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                    required
                  />
                  <span
                    className="input-icon eye-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      {showConfirmPassword ? (
                        <path fill="#999" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      ) : (
                        <path fill="#999" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      )}
                    </svg>
                  </span>
                </div>
                {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
              </div>
            </div>

            {/* Messages */}
            {errorMessage && <p className="form-message form-message-error">{errorMessage}</p>}
            {successMessage && <p className="form-message form-message-success">{successMessage}</p>}

            {/* Submit Button */}
            <button type="submit" className="signup-button" disabled={isLoading}>
              {isLoading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  CREATING ACCOUNT...
                </span>
              ) : (
                'SIGN UP'
              )}
            </button>

            {/* Login Link */}
            <div className="login-link">
              Already have an account? <Link to="/login" className="login-link-text">Log in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;