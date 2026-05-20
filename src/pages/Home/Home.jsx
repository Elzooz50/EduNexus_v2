import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import Header_Before_Login from '../../components/Header_Before_Login/Header_Before_Login.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { getAuthToken } from '../../services/authStorage';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const isAuthenticated = Boolean(getAuthToken() || localStorage.getItem('token') || sessionStorage.getItem('user'));
    navigate(isAuthenticated ? '/sign-up' : '/sign-up');
  };

  const handleLearnMore = () => {
    navigate('/about-us');
  };

  return (
    <>
      <Header_Before_Login />
      <div className="home-container">
        <div className="home-content">
          <div className="home-left">
            <div className="offer-badge">
              {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg> */}
              <img src="/src/assets/icons/offer-icon.png" alt="" />
              100% Free Forever -No Hidden Costs
            </div>

            <h1 className="main-title">
              <span className="title-dark">Smarter Classroom</span>
              <span className="title-orange">Where Learning Meets Innovation</span>
            </h1>

            <p className="description">
              Join Smarter Classroom and experience a new way of learning and teaching. 
              Connect with students and educators in real time, share ideas effortlessly, 
              and make every class more interactive, engaging, and smart — anytime, anywhere.
            </p>

            <button className="start-btn" onClick={handleGetStarted}>
           <svg fill="#000" width="800" height="800" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg"><g fillRule="evenodd"><path d="m564.03 308.47c10.422-7.4453 24.895.003906 24.895 12.809v157.44c0 12.805-14.473 20.254-24.895 12.812l-110.21-78.723c-8.793-6.2773-8.793-19.344.0-25.621zm-6.5938 43.402-67.375 48.129 67.375 48.125z"/><path d="m258.3 305.54c-8.6953.0-15.742 7.0469-15.742 15.742v157.44c0 8.6953 7.0469 15.742 15.742 15.742h173.19c8.6953.0 15.742-7.0469 15.742-15.742v-157.44c0-8.6953-7.0469-15.742-15.742-15.742zm0-31.488h173.19c26.082.0 47.23 21.145 47.23 47.23v157.44c0 26.086-21.148 47.23-47.23 47.23H258.3c-26.086.0-47.23-21.145-47.23-47.23v-157.44c0-26.086 21.145-47.23 47.23-47.23z"/></g></svg>
              Get Started
            </button>

            <div className="home-quick-actions">
              <button type="button" onClick={handleLearnMore}>Learn More</button>
            </div>

            <div className="stats">
              <div className="stat-item">
                <span className="stat-title">Free</span>
                <span className="stat-subtitle">Always</span>
              </div>
              <div className="stat-item">
                <span className="stat-title">Unlimited</span>
                <span className="stat-subtitle">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-title">AI-Powered</span>
                <span className="stat-subtitle">Questions</span>
              </div>
            </div>
          </div>

          <div className="home-right">
            <div className="browser-mockup">
              <div className="browser-header">
                <div className="browser-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="browser-title">Computer Vision -Live Now !</span>
              </div>
              <div className="browser-content">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop" 
                  alt="Students learning"
                  className="classroom-img"
                />
              </div>
            </div>

            <div className="quiz-card">
              <div className="quiz-header">
                <span className="quiz-title">AI Generated Quiz</span>
                <span className="live-badge">Live Now !</span>
              </div>
              <p className="quiz-question">What is the main goal of Computer Vision?</p>
              <div className="quiz-options">
                <div className="option">
                  <span className="option-label">A)</span>
                  <span className="option-text">To enable computers to understand and interpret visual information.</span>
                </div>
                <div className="option">
                  <span className="option-label">B)</span>
                  <span className="option-text">To increase internet connection speed and efficiency.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;