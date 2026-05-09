import React from 'react';
import './features.css';
import Header_Before_Login from '../../components/Header_Before_Login/Header_Before_Login.jsx';
import Footer from '../../components/Footer/Footer.jsx';

const Features = () => {
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#4A90E2">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <circle cx="8" cy="12" r="2" fill="white"/>
          <path d="M2 10h20" stroke="white" strokeWidth="0.5"/>
        </svg>
      ),
      title: 'Video Conferencing',
      description: 'HD video calls,screen sharingn,chat-everything you expect is here.',
      bgColor: '#E8F0FE'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#4CAF50">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      ),
      title: 'AI Quiz Generator',
      description: 'Automatically creates relevant questions based on your lesson content.',
      bgColor: '#E8F5E9'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#00BCD4">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
      title: 'Engagement Tracking',
      description: "See who's paying attention and who might be confused in real time.",
      bgColor: '#E0F7FA'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFC107">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="2"/>
        </svg>
      ),
      title: 'Live Analytics',
      description: 'Instant feedback on student understanding and lesson effectiveness',
      bgColor: '#FFF8E1'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#7986CB">
          <rect x="6" y="2" width="12" height="20" rx="2" fill="none" stroke="#7986CB" strokeWidth="2"/>
          <rect x="9" y="5" width="6" height="10" rx="1" fill="#7986CB"/>
        </svg>
      ),
      title: 'Multi-Device Support',
      description: 'Works on phone,tablets,laptops - students can join from anywhere.',
      bgColor: '#E8EAF6'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#42A5F5">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
        </svg>
      ),
      title: 'Cloud Recording',
      description: 'Record lessons and quiz results for later review and analysis.',
      bgColor: '#E3F2FD'
    }
  ];

  return (
    <>
      <Header_Before_Login />
      <div className="features-container">
        <div className="features-content">
          <h1 className="features-title">Everything You Need,Completely Free</h1>
          <p className="features-subtitle">
            Enjoy live classes, recorded lessons, and progress tracking — all free on EduAura.
          </p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon" style={{ backgroundColor: feature.bgColor }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Free Forever
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Features;