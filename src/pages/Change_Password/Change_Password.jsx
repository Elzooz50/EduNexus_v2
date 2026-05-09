import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './change_password.css';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  // @ts-ignore
  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('Password changed successfully.');
  };

  return (
    <main className="change-password-page">
      <section className="change-password-card">
        <h1>Change Password</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Current Password
            <input type="password" required />
          </label>
          <label>
            New Password
            <input type="password" required />
          </label>
          <label>
            Confirm Password
            <input type="password" required />
          </label>
          {message && <p className="success-message">{message}</p>}
          <div className="actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => navigate('/profile')}>Cancel</button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ChangePassword;
