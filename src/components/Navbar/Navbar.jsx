import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuthToken  } from '../../services/authStorage.js';
import './navbar.css';

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'Login', to: '/login' }
];

const privateLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Profile', to: '/profile' }
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = getAuthToken() || localStorage.getItem('token');
  const sessionUser = sessionStorage.getItem('user');
  const isAuthenticated = Boolean(token || sessionUser);
  

  const links = isAuthenticated ? privateLinks : publicLinks;
  const isActive = (/** @type {string} */ path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <header className="app-navbar">
      <button type="button" className="brand-link" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
        EduAura
      </button>

      <nav className="nav-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={isActive(link.to) ? 'active' : ''}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <span className="nav-user">{'User'}</span>
            <button type="button" className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button type="button" className="nav-login" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
