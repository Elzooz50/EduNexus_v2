import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { updateAccount, changePassword, logoutFromServer } from '../../services/authService';
import { getApiErrorMessage } from '../../services/apiClient';
import './settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user;
  // eslint-disable-next-line no-unused-vars
  const refreshProfile = authContext?.refreshProfile;
  const logout = authContext?.logout;

  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    secondName: user?.secondName || '',
    thirdName: user?.thirdName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
    ssn: user?.ssn || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateAccount(profileForm);
      setMessage({ type: 'success', text: '✅ Profile updated successfully. You will be logged out now.' });

      try {
        await logoutFromServer();
      } catch {
        // ignore
      }
      logout?.();
      setIsSaving(false);
      navigate('/login', { replace: true });
      return;
    } catch (error) {
      setMessage({ type: 'error', text: getApiErrorMessage(error, 'Failed to update profile.') });
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordErrors({});
    setMessage({ type: '', text: '' });

    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (passwordForm.newPassword.length < 8) errors.newPassword = 'At least 8 characters';
    if (!/[A-Z]/.test(passwordForm.newPassword)) errors.newPassword = 'Needs 1 uppercase letter';
    if (!/[a-z]/.test(passwordForm.newPassword)) errors.newPassword = 'Needs 1 lowercase letter';
    if (!/[0-9]/.test(passwordForm.newPassword)) errors.newPassword = 'Needs 1 number';
    if (/[^a-zA-Z0-9]/.test(passwordForm.newPassword)) errors.newPassword = 'No special characters allowed';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsSaving(true);

    try {
      await changePassword(user?.id, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setMessage({ type: 'success', text: '✅ Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: getApiErrorMessage(error, 'Failed to change password.') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutFromServer();
    } catch {
      // ignore
    }
    logout?.();
    navigate('/login', { replace: true });
  };

  return (
    <div className="settings-page">
      {/* Background decorations */}
      <div className="st-bg-shape shape-a"></div>
      <div className="st-bg-shape shape-b"></div>

      {/* Back Button */}
      <button className="st-back-btn" onClick={() => { 
        window.history.back(); 
        setTimeout(() => window.location.reload(), 250); 
      }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="st-header">
        <h1>Settings</h1>
        <p>Manage your account details and security</p>
      </div>

      {/* Tabs */}
      <div className="st-tabs">
        <button
          className={`st-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => { setActiveTab('profile'); setMessage({ type: '', text: '' }); }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Edit Profile
        </button>
        <button
          className={`st-tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => { setActiveTab('password'); setMessage({ type: '', text: '' }); }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Change Password
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`st-message ${message.type}`}>{message.text}</div>
      )}

      {activeTab === 'profile' && (
        <form className="st-form" onSubmit={handleProfileSubmit}>
          <div className="st-form-row">
            <div className="st-form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={profileForm.firstName} onChange={handleProfileChange} required />
            </div>
            <div className="st-form-group">
              <label>Second Name</label>
              <input type="text" name="secondName" value={profileForm.secondName} onChange={handleProfileChange} />
            </div>
          </div>

          <div className="st-form-row">
            <div className="st-form-group">
              <label>Third Name</label>
              <input type="text" name="thirdName" value={profileForm.thirdName} onChange={handleProfileChange} />
            </div>
            <div className="st-form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={profileForm.lastName} onChange={handleProfileChange} required />
            </div>
          </div>

          <div className="st-form-group">
            <label>SSN</label>
            <input type="text" value={profileForm.ssn} disabled className="st-disabled-input" />
            <span className="st-hint">SSN cannot be changed</span>
          </div>

          <div className="st-form-group">
            <label>Phone Number</label>
            <input type="tel" name="phoneNumber" value={profileForm.phoneNumber} onChange={handleProfileChange} required />
          </div>

          <div className="st-form-group">
            <label>Email</label>
            <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} required />
          </div>

          <button type="submit" className="st-save-btn" disabled={isSaving}>
            {isSaving ? <><span className="spinner"></span> Saving...</> : 'Save Changes'}
          </button>
        </form>
      )}

      {activeTab === 'password' && (
        <form className="st-form" onSubmit={handlePasswordSubmit}>
          <div className="st-form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              className={passwordErrors.currentPassword ? 'input-error' : ''}
              required
            />
            {passwordErrors.currentPassword && <span className="field-error">{passwordErrors.currentPassword}</span>}
          </div>

          <div className="st-form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="Min. 8 chars, A-Z, a-z, 0-9"
              className={passwordErrors.newPassword ? 'input-error' : ''}
              required
            />
            {passwordErrors.newPassword && <span className="field-error">{passwordErrors.newPassword}</span>}
            {passwordForm.newPassword && !passwordErrors.newPassword && (
              <div className="password-strength">
                <span className={`strength-rule ${passwordForm.newPassword.length >= 8 ? 'passed' : ''}`}>✓ 8+ characters</span>
                <span className={`strength-rule ${/[A-Z]/.test(passwordForm.newPassword) ? 'passed' : ''}`}>✓ Uppercase</span>
                <span className={`strength-rule ${/[a-z]/.test(passwordForm.newPassword) ? 'passed' : ''}`}>✓ Lowercase</span>
                <span className={`strength-rule ${/[0-9]/.test(passwordForm.newPassword) ? 'passed' : ''}`}>✓ Number</span>
                <span className={`strength-rule ${!/[^a-zA-Z0-9]/.test(passwordForm.newPassword) ? 'passed' : ''}`}>✓ No symbols</span>
              </div>
            )}
          </div>

          <div className="st-form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Re-enter new password"
              className={passwordErrors.confirmPassword ? 'input-error' : ''}
              required
            />
            {passwordErrors.confirmPassword && <span className="field-error">{passwordErrors.confirmPassword}</span>}
          </div>

          <button type="submit" className="st-save-btn" disabled={isSaving}>
            {isSaving ? <><span className="spinner"></span> Changing...</> : 'Change Password'}
          </button>
        </form>
      )}

      <div className="st-danger-zone">
        <div className="st-danger-content">
          <div>
            <h3>Logout</h3>
            <p>Sign out of your account</p>
          </div>
          <button className="st-logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;