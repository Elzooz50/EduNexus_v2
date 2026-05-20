import React from 'react';
import './about_us.css';
import Header_Before_Login from '../../components/Header_Before_Login/Header_Before_Login.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import eslamTaha from '../../assets/images/eslam-taha.png';
import aliHassan from '../../assets/images/ali-hassan.png';
import ayaOmar from '../../assets/images/aya-omar.png';
import aboutHeroImage from '../../assets/images/About-1st.png';

const About_Us = () => {
  const team = [
    {
      image: eslamTaha,
      name: 'Dr.Eslam Taha',
      role: 'Artificial Intelligence'
    },
    {
      image: aliHassan,
      name: 'Dr.Ali Hassan',
      role: 'Compiler Theory'
    },
    {
      image: ayaOmar,
      name: 'Dr.Aya Omar',
      role: 'Computer Vision'
    }
  ];

  const testimonials = [
    {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
      name: 'John Games',
      rating: 4.0,
      text: 'Using EduAura has been a great experience! The platform is super easy to use, smart, and really helps me stay engaged during classes. I love how everything runs smoothly.'
    },
    {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
      name: 'Joliana Hany',
      rating: 5.0,
      text: "I've really enjoyed using this platform — it's simple, smart, and saves me a lot of time. The interactive tools make learning fun, and the AI features feel like having a personal assistant in class."
    },
    {
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop',
      name: 'Johan Marthy',
      rating: 4.0,
      text: "I've had a great experience with this platform — it's intuitive, intelligent, and makes studying much easier. The interactive features keep me engaged, and the AI tools add a very smart touch."
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i} 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill={i <= rating ? "#FFC107" : "#E0E0E0"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      );
    }
    return stars;
  };

  return (
    <>
      <Header_Before_Login />
      <div className="about-container">
        {/* Hero Section */}
        <div className="about-hero">
          <div className="hero-left">
            <img 
              src={aboutHeroImage} 
              alt="Online learning"
              className="hero-image"
            />
          </div>
          <div className="hero-right">
            <h1 className="about-title">
              About <span className="highlight">EduNexus Platform</span>
            </h1>
            <p className="about-description">
              EduNexus is a new, smart learning platform designed to make education more interactive and inspiring. It connects teachers and learners through real-time communication, smart sharing tools, and AI-powered features.
            </p>
            <div className="users-badge">
              <div className="user-avatars">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop" alt="User" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop" alt="User" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" alt="User" />
              </div>
              <span className="users-count">10K+ User</span>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2 className="section-title">Our Team In EduNexus</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-image-wrapper">
                  <img src={member.image} alt={member.name} className="team-image" />
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials-section">
          <h2 className="testimonials-title">
            Loved by teams <span className="highlight">around the world</span>
          </h2>
          <div className="users-badge-center">
            <div className="user-avatars">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop" alt="User" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop" alt="User" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" alt="User" />
            </div>
            <span className="users-count">10K+ User</span>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-header">
                  <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <div className="testimonial-rating">
                      <span className="rating-number">{testimonial.rating.toFixed(1)}</span>
                      <div className="stars">{renderStars(testimonial.rating)}</div>
                    </div>
                  </div>
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About_Us;