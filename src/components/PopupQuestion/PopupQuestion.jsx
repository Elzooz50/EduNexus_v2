import { useEffect, useState } from 'react';
import './popupQuestion.css';

export const PopupQuestion = ({
  isOpen,
  question,
  options = [],
  onClose,
  onAnswer,
  autoCloseTime = 30
}) => {
  const [timer, setTimer] = useState(autoCloseTime);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Reset timer when popup opens/closes
  useEffect(() => {
    if (isOpen) {
      setTimer(autoCloseTime);
      setSelectedAnswer(null);
    }
  }, [isOpen, autoCloseTime]);

  const handleAutoClose = () => {
    onClose();
  };

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option.id);
    if (onAnswer) {
      onAnswer(option);
    }
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleClose = () => {
    setSelectedAnswer(null);
    onClose();
  };

  if (!isOpen) return null;

  const timerPercentage = (timer / autoCloseTime) * 100;

  return (
    <div className="popup-question-overlay">
      <div className={`popup-question-container slide-in`}>
        {/* Timer Bar */}
        <div className="popup-timer-bar">
          <div
            className="popup-timer-fill"
            style={{ width: `${timerPercentage}%` }}
          ></div>
        </div>

        {/* Header with close button */}
        <div className="popup-header">
          <h3 className="popup-title">Question</h3>
          <button
            className="popup-close-btn"
            onClick={handleClose}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Question text */}
        <div className="popup-question-text">
          <p>{question}</p>
        </div>

        {/* Options */}
        <div className="popup-options">
          {options && options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.id}
                className={`popup-option-btn ${
                  selectedAnswer === option.id ? 'selected' : ''
                }`}
                onClick={() => handleAnswerClick(option)}
                disabled={selectedAnswer !== null}
              >
                {option.text}
              </button>
            ))
          ) : (
            <p className="popup-no-options">No options available</p>
          )}
        </div>

        {/* Timer text */}
        <div className="popup-timer-text">
          Auto-closing in {timer}s
        </div>
      </div>
    </div>
  );
};

export default PopupQuestion;
