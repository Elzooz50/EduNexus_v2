import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./get_started.css";  // Changed to .css instead of .module.css
import getStartedBg from '../../assets/backgrounds/Get_Started.jpg';
import arrowRightIcon from '../../assets/icons/arrow-right.svg';
import { isAuthenticated, getUserRoleId, ROLE_ROUTES } from "../../services/authStorage";

export default function Get_Started() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedGetStarted") === "true";
    if (isAuthenticated()) {
      const roleId = getUserRoleId();
      const redirectPath = ROLE_ROUTES[roleId] || "/home";
      navigate(redirectPath, { replace: true });
    } else if (hasVisited) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleStart = () => {
    localStorage.setItem("hasVisitedGetStarted", "true");
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
        <span>Get Started</span>
      </button>
    </div>
  );
}