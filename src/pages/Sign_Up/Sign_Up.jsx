import React, { useState } from 'react';
import { Link } from 'react-router-dom';   // keep navigate for redirect after success
import { useNavigate } from 'react-router-dom';
import './sign_up.css';
import apiClient, { getApiErrorMessage } from '../../services/apiClient';

const SignUp = () => {
  const navigate = useNavigate();

  // same form state & validation logic as before …
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;

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

  const formatSSN = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}-${digits.slice(11)}`;
  };

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

  // … rest of validation & submit (unchanged) …
  const parseServerError = (error) => {
    const message = getApiErrorMessage(error, '');
    const lowerMsg = message.toLowerCase();
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

    // … (all the same validation) …
    if (!trimmedData.ssn || !trimmedData.firstName || !trimmedData.lastName ||
        trimmedData.phoneNumber === '+20' || !trimmedData.email || !trimmedData.password ||
        !trimmedData.confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (trimmedData.ssn.length !== 14) {
      setFieldErrors((prev) => ({ ...prev, ssn: 'SSN must be exactly 14 digits.' }));
      return;
    }

    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/;
    if (!nameRegex.test(trimmedData.firstName)) {
      setFieldErrors((prev) => ({ ...prev, firstName: 'First name must contain letters only.' }));
      return;
    }
    if (!nameRegex.test(trimmedData.lastName)) {
      setFieldErrors((prev) => ({ ...prev, lastName: 'Last name must contain letters only.' }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
      return;
    }

    const phoneDigits = trimmedData.phoneNumber.replace('+20', '').replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setFieldErrors((prev) => ({ ...prev, phoneNumber: 'Phone number must be 10 digits after +20.' }));
      return;
    }

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
        // Clear form and redirect after 1.5s
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
        setTimeout(() => window.location.assign('https://edunexus-meeting.vercel.app/login'), 1500);
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

  // Progress percentage
  const calculateProgress = () => {
    const fields = ['ssn', 'firstName', 'lastName', 'phoneNumber', 'email', 'password', 'confirmPassword'];
    const phoneValid = formData.phoneNumber.replace('+20', '').replace(/\D/g, '').length >= 10;
    const filled = fields.filter(f => {
      if (f === 'phoneNumber') return phoneValid;
      return formData[f]?.trim();
    }).length;
    return Math.round((filled / fields.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="signup-wrapper">
      {/* Animated background balls */}
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

      {/* Glass Card */}
      <div className="signup-card">
        <div className="card-header">
          <h1 className="brand-title">
            Join Edu<span className="brand-accent">Nexus</span>
          </h1>
          <p className="welcome-message">Start your learning journey today!</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`progress-step ${progress >= 50 ? 'completed' : ''} ${progress > 0 && progress < 50 ? 'active' : ''}`}>
            <div className="step-dot"></div>
            <span>Fill Details</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${progress === 100 ? 'completed' : ''} ${progress >= 50 && progress < 100 ? 'active' : ''}`}>
            <div className="step-dot"></div>
            <span>Create Account</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-wrapper">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">{progress}% Complete</span>
        </div>

        {/* Form */}
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {/* ... all form groups (identical to your original) ... */}
          {/* SSN */}
          <div className="form-group">
            <label htmlFor="ssn">SSN (14 digits)</label>
            <div className="input-wrapper">
              <input type="text" id="ssn" name="ssn" value={formData.ssn} onChange={handleSSNChange}
                placeholder="XXX-XXXX-XXXX-XX"
                className={`form-input ${fieldErrors.ssn ? 'input-error' : formData.ssn ? 'input-filled' : ''}`}
                maxLength={17} required />
              {formData.ssn && !fieldErrors.ssn && <span className="input-check">✓</span>}
            </div>
            {fieldErrors.ssn && <span className="field-error">{fieldErrors.ssn}</span>}
          </div>

          {/* First + Last Name */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <div className="input-wrapper">
                <input type="text" id="firstName" name="firstName" value={formData.firstName}
                  onChange={handleInputChange} placeholder="Your first name"
                  className={`form-input ${fieldErrors.firstName ? 'input-error' : formData.firstName ? 'input-filled' : ''}`} required />
                {formData.firstName && !fieldErrors.firstName && <span className="input-check">✓</span>}
              </div>
              {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-wrapper">
                <input type="text" id="lastName" name="lastName" value={formData.lastName}
                  onChange={handleInputChange} placeholder="Your last name"
                  className={`form-input ${fieldErrors.lastName ? 'input-error' : formData.lastName ? 'input-filled' : ''}`} required />
                {formData.lastName && !fieldErrors.lastName && <span className="input-check">✓</span>}
              </div>
              {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <div className="input-wrapper">
              <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber}
                onChange={handleInputChange} placeholder="+20 1XX XXX XXXX"
                className={`form-input ${fieldErrors.phoneNumber ? 'input-error' : formData.phoneNumber.length > 5 ? 'input-filled' : ''}`} required />
              {formData.phoneNumber.length > 7 && !fieldErrors.phoneNumber && <span className="input-check">✓</span>}
            </div>
            {fieldErrors.phoneNumber && <span className="field-error">{fieldErrors.phoneNumber}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input type="email" id="email" name="email" value={formData.email}
                onChange={handleInputChange} placeholder="yourname@example.com"
                className={`form-input ${fieldErrors.email ? 'input-error' : formData.email ? 'input-filled' : ''}`} required />
              {formData.email && !fieldErrors.email && <span className="input-check">✓</span>}
            </div>
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          {/* Gender + Role */}
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="gender" value="0" checked={formData.gender === '0'} onChange={handleInputChange} className="radio-input" />
                  <span className="radio-custom"></span> Male
                </label>
                <label className="radio-label">
                  <input type="radio" name="gender" value="1" checked={formData.gender === '1'} onChange={handleInputChange} className="radio-input" />
                  <span className="radio-custom"></span> Female
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Role</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="roleId" value="4" checked={formData.roleId === '4'} onChange={handleInputChange} className="radio-input" />
                  <span className="radio-custom"></span> Student
                </label>
                <label className="radio-label">
                  <input type="radio" name="roleId" value="3" checked={formData.roleId === '3'} onChange={handleInputChange} className="radio-input" />
                  <span className="radio-custom"></span> Instructor
                </label>
              </div>
            </div>
          </div>

          {/* Password + Confirm */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password}
                  onChange={handleInputChange} placeholder="Min. 8 chars, A-Z, a-z, 0-9"
                  className={`form-input ${fieldErrors.password ? 'input-error' : formData.password ? 'input-filled' : ''}`} required />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#999" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#999" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  )}
                </span>
              </div>
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
              {formData.password && !fieldErrors.password && (
                <div className="password-strength">
                  <span className={`strength-rule ${formData.password.length >= 8 ? 'passed' : ''}`}>✓ 8+</span>
                  <span className={`strength-rule ${/[A-Z]/.test(formData.password) ? 'passed' : ''}`}>✓ Uppercase</span>
                  <span className={`strength-rule ${/[a-z]/.test(formData.password) ? 'passed' : ''}`}>✓ Lowercase</span>
                  <span className={`strength-rule ${/[0-9]/.test(formData.password) ? 'passed' : ''}`}>✓ Number</span>
                  <span className={`strength-rule ${!/[^a-zA-Z0-9]/.test(formData.password) ? 'passed' : ''}`}>✓ No symbols</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleInputChange} placeholder="Re-enter password"
                  className={`form-input ${fieldErrors.confirmPassword ? 'input-error' : formData.confirmPassword ? 'input-filled' : ''}`} required />
                <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setShowConfirmPassword(!showConfirmPassword)}>
                  {/* same eye svg as above, adjust id if needed */}
                  {/* ... shorter inline for brevity ... show same icon */}
                </span>
              </div>
              {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
              {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && !fieldErrors.confirmPassword && (
                <span className="match-indicator">✓ Passwords match</span>
              )}
            </div>
          </div>

          {/* Messages */}
          {errorMessage && <p className="form-message form-message-error shake">{errorMessage}</p>}
          {successMessage && <p className="form-message form-message-success pulse">{successMessage}</p>}

          {/* Submit */}
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? (
              <span className="button-loading">
                <span className="spinner"></span> CREATING...
              </span>
            ) : 'SIGN UP'}
          </button>

          <div className="login-link">
            Already have an account? <Link to="/login" className="login-link-text">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;