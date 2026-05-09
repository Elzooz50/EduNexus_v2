import React from 'react';
import './how_it_works.css';
import Header_Before_Login from '../../components/Header_Before_Login/Header_Before_Login.jsx';
import Footer from '../../components/Footer/Footer.jsx';

const How_It_Works = () => {
  const steps = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#4A90E2">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <circle cx="8" cy="12" r="2" fill="white"/>
          <path d="M2 10h20" stroke="white" strokeWidth="0.5"/>
        </svg>
      ),
      title: 'Start Meeting',
      description: 'Join your meeting with confidence experience high quality connections .',
      bgColor: '#E8F0FE',
      number: '01'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#9C27B0">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      ),
      title: 'Speech To Text',
      description: 'Our AI listens and translates audio to text.',
      bgColor: '#F3E5F5',
      number: '02'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#4CAF50">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#4CAF50" strokeWidth="2"/>
          <text x="12" y="16" textAnchor="middle" fill="#4CAF50" fontSize="12" fontWeight="bold">?</text>
        </svg>
      ),
      title: 'Auto Quiz',
      description: 'Our AI automatically creates simple and smart questions fastly',
      bgColor: '#E8F5E9',
      number: '03'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFC107">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="#FFC107" strokeWidth="2"/>
          <polyline points="7 13 10 16 17 9" fill="none" stroke="#FFC107" strokeWidth="2"/>
        </svg>
      ),
      title: 'Live Results',
      description: 'this keeps you updated in real time ,see questions results and track progress',
      bgColor: '#FFF8E1',
      number: '04'
    }
  ];

  return (
    <>
      <Header_Before_Login />
      <div className="how-it-works-container">
        <div className="floating-element floating-1"></div>
        <div className="floating-element floating-2"></div>
        <div className="floating-element floating-3"></div>
        
        <div className="hero-image">
          <img 
            src="/src/assets/images/how-itworks-bg.png" 
            alt="Video conference meeting"
            className="hero-img"
          />
        </div>
        
        <div className="how-it-works-content">
          <h1 className="how-it-works-title">How EduNexus Works</h1>
          <p className="how-it-works-subtitle">
            EduNexus empowers seamless interaction between students and educators through an intelligent learning platform.
          </p>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div className="step-card" key={index}>
                <div className="ripple"></div>
                <span className="step-number">{step.number}</span>
                
                <div className="step-icon" style={{ backgroundColor: step.bgColor }}>
                  {step.icon}
                </div>
                
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default How_It_Works;