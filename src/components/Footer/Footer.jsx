import React from 'react';
import { useNavigate } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/sign-up');
  };

  return (
    <div className="footer-container">
      <h2 className="footer-title">Ready to Make Teaching Smarter?</h2>
      <p className="footer-subtitle">
        Join our smarter platform for effortless, engaging online meetings — wherever you are.
      </p>
      <p className="footer-subtitle-secondary">
        and make every session more interactive and productive
      </p>
      
      <button className="footer-btn" onClick={handleClick}>
        <svg className='camera-logo' fill="currentColor" width="800" height="800" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg"><g fillRule="evenodd"><path d="m564.03 308.47c10.422-7.4453 24.895.003906 24.895 12.809v157.44c0 12.805-14.473 20.254-24.895 12.812l-110.21-78.723c-8.793-6.2773-8.793-19.344.0-25.621zm-6.5938 43.402-67.375 48.129 67.375 48.125z"/><path d="m258.3 305.54c-8.6953.0-15.742 7.0469-15.742 15.742v157.44c0 8.6953 7.0469 15.742 15.742 15.742h173.19c8.6953.0 15.742-7.0469 15.742-15.742v-157.44c0-8.6953-7.0469-15.742-15.742-15.742zm0-31.488h173.19c26.082.0 47.23 21.145 47.23 47.23v157.44c0 26.086-21.148 47.23-47.23 47.23H258.3c-26.086.0-47.23-21.145-47.23-47.23v-157.44c0-26.086 21.145-47.23 47.23-47.23z"/></g></svg>
        Start Teaching Free
      </button>
      
      <p className="footer-note">No credit card required -No hidden fees .Always free</p>
    </div>
  );
};

export default Footer;