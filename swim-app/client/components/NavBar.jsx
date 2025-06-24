import React, { useContext, useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { userContext } from './App';
import Cookies from 'js-cookie';
import UserDashboard from './UserDashboard';
import '../styles/NavBar.css';
import logo from '../assets/logo.png';

function NavBar() {
  const { userData, setUserData } = useContext(userContext);
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove('accessToken');
    setUserData(null);
    localStorage.removeItem('currentUser');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo" onClick={handleLinkClick}>
          <img src={logo} alt="SwimSchool Logo" />
        </Link>

        <button
          className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/home" className="nav-link" onClick={handleLinkClick}>
              דף בית
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link" onClick={handleLinkClick}>
              מי אנחנו
            </NavLink>
          </li>
          <li>
            <NavLink to="/branches" className="nav-link" onClick={handleLinkClick}>
              סניפים
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="nav-link" onClick={handleLinkClick}>
              צור קשר
            </NavLink>
          </li>
        </ul>

        <div className={`navbar-auth ${mobileMenuOpen ? 'open' : ''}`}>
          {userData ? (
            <div className="user-section">
              <UserDashboard />
              <button onClick={handleLogout} className="btn btn-logout">
                התנתק
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <NavLink to="/login" className="btn btn-login" onClick={handleLinkClick}>
                התחברות
              </NavLink>
              <NavLink to="/signup" className="btn btn-signup" onClick={handleLinkClick}>
                הרשמה
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
