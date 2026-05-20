import React from 'react';
import { Link } from 'react-router-dom';
import './notFound.css';

const NotFound = () => {
  return (
    <div className="nf-page">
      {/* Navigation */}
      <nav className="nf-nav">
        <div className="nf-nav-left">
          <Link to="/" className="nf-brand">Edu<span className="nf-brand-accent">Nexus</span></Link>
        </div>
        <div className="nf-nav-center">
          <Link to="/features" className="nf-nav-link">Features</Link>
          <Link to="/how-it-works" className="nf-nav-link">HowItWorks</Link>
          <Link to="/about-us" className="nf-nav-link">AboutUs</Link>
        </div>
        <div className="nf-nav-right">
          <Link to="/login" className="nf-btn-login">Login</Link>
          <Link to="/sign-up" className="nf-btn-signup">SignUpFree</Link>
        </div>
      </nav>

      {/* 404 Content */}
      <main className="nf-main">
        <div className="nf-content">
          <div className="nf-image-wrapper">
            <img
              src="/src/assets/images/404.png"
              alt="404 illustration"
              className="nf-404-image"
            />
          </div>
          <div className="nf-text">
            <h1 className="nf-oops">Oops!</h1>
            <h2 className="nf-error-code">404 ERROR</h2>
            <p className="nf-message">
              Oops! This page can't be found.<br />
              It looks like you've wandered off the learning path. Don't worry—you need to sign in only!
            </p>
            <Link to="/" className="nf-btn-home">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;