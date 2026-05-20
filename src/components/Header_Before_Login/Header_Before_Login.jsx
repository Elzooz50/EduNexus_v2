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
        <img src={logo} alt="logo" />
        <span className="brand-name">EduNexus</span>

      </div>

      {/* Desktop Navigation */}
      <nav className="header-nav-desktop">
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
        </button>
      </nav>

      {/* Hamburger menu button - visible on mobile */}
      <button className="menu-toggle" onClick={toggleMenu}>
        <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Mobile Navigation */}
      <nav className={`header-nav-mobile ${menuOpen ? 'open' : ''}`}>
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
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header_Before_Login;