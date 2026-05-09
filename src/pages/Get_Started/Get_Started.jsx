import { useNavigate } from "react-router-dom";
import "./get_started.css";  // Changed to .css instead of .module.css

export default function Get_Started() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/home");  // <-- navigate to /home
  };
  
  return (
    <div className="page">
      <img 
        className="bg-img" 
        src="/src/assets/backgrounds/Get_Started.jpg" 
        alt="Background" 
      />
      <button className="start-btn" onClick={handleStart}>
        <div className="vector">
          <img 
            src="/src/assets/icons/arrow-right.svg" 
            alt="arrow right" 
          />
        </div> 
        Get Started
      </button>
    </div>
  );
}