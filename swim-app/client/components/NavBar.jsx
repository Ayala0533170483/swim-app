import React, { useContext } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { userContext } from './App';
import Cookies from 'js-cookie';
import UserDashboard from './UserDashboard';
import '../styles/NavBar.css';
import logo from '../assets/logo.png';

function NavBar() {
  const { userData, setUserData } = useContext(userContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    setUserData(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          <img src={logo} alt="SwimSchool Logo" />
        </Link>

        <ul className="navbar-links">
          <li><NavLink to="/home" className="nav-link">דף בית</NavLink></li>
          <li><NavLink to="/about" className="nav-link">מי אנחנו</NavLink></li>
          <li><NavLink to="/branches" className="nav-link">סניפים</NavLink></li>
          <li><NavLink to="/contact" className="nav-link">צור קשר</NavLink></li>
        </ul>

        <div className="navbar-auth">
          {userData ? (
            <div className="user-section">
              <UserDashboard />
              <button
                onClick={handleLogout}
                className="btn btn-logout"
              >
                התנתק
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-login">התחברות</NavLink>
              <NavLink to="/signup" className="btn btn-signup">הרשמה</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
