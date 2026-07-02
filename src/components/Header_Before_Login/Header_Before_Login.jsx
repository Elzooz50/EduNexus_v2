import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './header_before_login.css';
import logo from '../../assets/icons/Logo.svg';

const Header_Before_Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/features') setActiveTab('features');
    else if (path === '/how-it-works') setActiveTab('how-it-works');
    else if (path === '/about-us') setActiveTab('about-us');
    else if (path === '/login') setActiveTab('login');
    else if (path === '/sign-up') setActiveTab('sign-up');
    else setActiveTab('');

    setMenuOpen(false);
  }, [location]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-left" onClick={handleLogoClick}>
        <div className="logo-wrapper">
          <img src={logo} alt="EduNexus Logo" />
        </div>
        <span className="brand-name">
          <span className="brand-edu">Edu</span>
          <span className="brand-nexus">Nexus</span>
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="header-nav-desktop" aria-label="Main navigation">
        <button
          className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => handleTabClick('features', '/features')}
          aria-current={activeTab === 'features' ? 'page' : undefined}
        >
          Features
        </button>
        <button
          className={`nav-link ${activeTab === 'how-it-works' ? 'active' : ''}`}
          onClick={() => handleTabClick('how-it-works', '/how-it-works')}
          aria-current={activeTab === 'how-it-works' ? 'page' : undefined}
        >
          How It Works
        </button>
        <button
          className={`nav-link ${activeTab === 'about-us' ? 'active' : ''}`}
          onClick={() => handleTabClick('about-us', '/about-us')}
          aria-current={activeTab === 'about-us' ? 'page' : undefined}
        >
          About Us
        </button>
        <button
          className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => handleTabClick('login', '/login')}
          aria-current={activeTab === 'login' ? 'page' : undefined}
        >
          Login
        </button>
      </nav>

      <div className="header-actions-desktop">
        <button
          className={`nav-btn-signup ${activeTab === 'sign-up' ? 'active' : ''}`}
          onClick={() => handleTabClick('sign-up', '/sign-up')}
          aria-current={activeTab === 'sign-up' ? 'page' : undefined}
        >
          Sign Up Free
          <span className="btn-icon" aria-hidden="true">→</span>
        </button>
      </div>

      {/* Hamburger menu button */}
      <button
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Mobile Navigation */}
      <nav
        className={`header-nav-mobile ${menuOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="nav-buttons">
          <button
            className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => handleTabClick('features', '/features')}
          >
            Features
          </button>
          <button
            className={`nav-link ${activeTab === 'how-it-works' ? 'active' : ''}`}
            onClick={() => handleTabClick('how-it-works', '/how-it-works')}
          >
            How It Works
          </button>
          <button
            className={`nav-link ${activeTab === 'about-us' ? 'active' : ''}`}
            onClick={() => handleTabClick('about-us', '/about-us')}
          >
            About Us
          </button>
          <button
            className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabClick('login', '/login')}
          >
            Login
          </button>
          <button
            className={`nav-btn-signup ${activeTab === 'sign-up' ? 'active' : ''}`}
            onClick={() => handleTabClick('sign-up', '/sign-up')}
          >
            Sign Up Free
            <span className="btn-icon" aria-hidden="true">→</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header_Before_Login;