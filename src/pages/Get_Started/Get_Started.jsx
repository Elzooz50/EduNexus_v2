import { useNavigate } from "react-router-dom";
import "./get_started.css";  // Changed to .css instead of .module.css
import getStartedBg from '../../assets/backgrounds/Get_Started.jpg';
import arrowRightIcon from '../../assets/icons/arrow-right.svg';

export default function Get_Started() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/home");  // <-- navigate to /home
  };
  
  return (
    <div className="page">
      <img 
        className="bg-img" 
        src={getStartedBg} 
        alt="Background" 
      />
      <button className="start-btn" onClick={handleStart}>
        <div className="vector">
          <img 
            src={arrowRightIcon} 
            alt="arrow right" 
          />
        </div> 
        Get Started
      </button>
    </div>
  );
}