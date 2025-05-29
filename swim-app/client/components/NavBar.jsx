import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/NavBar.css';
import logo from '../assets/logo.png';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbarLogo">
        <img src={logo} alt="Logo" />
        <h1>SwimSchool</h1>
      </div>
      <ul className="navbarLinks">
        <li><NavLink to="/home">דף בית</NavLink></li>
        <li><NavLink to="/about">מי אנחנו</NavLink></li>
        <li><NavLink to="/branches">סניפים</NavLink></li>
        <li><NavLink to="/contact" >צור קשר</NavLink></li>
      </ul>

      <div className="navbarAuth">
        {/* בשלב הראשון אין עדיין סטייט של user, אז תמיד נראה התחברות/הרשמה */}
        <NavLink to="/login" className="btn">התחברות</NavLink>
        <NavLink to="/signup" className="btn btn--primary">הרשמה</NavLink>
      </div>
    </nav>
  );
}

export default NavBar;