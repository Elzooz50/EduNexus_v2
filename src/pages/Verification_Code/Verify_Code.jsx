import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './verify_code.css';
const Verification_Code = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(29);
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    navigate('/forget-password');
  };

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    console.log('Code submitted:', fullCode);
    // Handle verification logic here
  };

  const handleResend = () => {
    setTimer(29);
    console.log('Resending code...');
  };

  const formatTime = (seconds) => {
    return `00:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="verify-container">
      <div className="verify-header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="header-title">Verification Code</span>
        <div className='right-side'>
          <img src="/src/assets/icons/Logo.svg" alt="" />
          <div>
            <span className="brand-text">Edu</span>
            <span className="brand-highlight">Nexus</span>
          </div>
        </div>
      </div>

      <div className="verify-content">
        <div className="illustration">
          <img src='/src/assets/images/Verify_code-illustration.png' alt="Verification illustration" />
        </div>

        <h1 className="verify-title">Verify email address</h1>
        <p className="verify-subtitle">
          enter verification code that sent to your email.
        </p>

        <form className="verify-form" onSubmit={handleSubmit}>
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) {
                    inputRefs.current[index] = el;
                  }
                }}
                type="text"
                className="code-input"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
              />
            ))}
          </div>

          <button type="submit" className="btn-confirm">
            Confirm Code
          </button>
        </form>

        <div className="resend-section">
          <span className="timer">{formatTime(timer)}</span>
          <button 
            className="resend-btn" 
            onClick={handleResend}
            disabled={timer > 0}
          >
            Resend Confirmation code
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verification_Code;