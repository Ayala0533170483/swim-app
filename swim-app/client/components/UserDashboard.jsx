import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userContext } from './App';
import '../styles/UserDashboard.css';

function UserDashboard() {
  const { userData } = useContext(userContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // סגירת התפריט כשלוחצים מחוץ לו
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // פונקציה לקבלת תפריט לפי סוג משתמש
  const getUserMenuItems = () => {
    if (!userData) return [];

    const usernameForUrl = userData.name.toLowerCase().replace(/\s+/g, '-');

    switch (userData.type_id) {
      case 2: // תלמיד
        return [
          { path: `/${usernameForUrl}/my-lessons`, label: 'השיעורים שלי' },
          { path: `/${usernameForUrl}/register-lesson`, label: 'רישום לשיעור חדש' },
          { path: `/${usernameForUrl}/profile`, label: 'הפרופיל שלי' }

        ];
      case 3: // מורה
        return [
          { path: `/${usernameForUrl}/my-lessons`, label: 'השיעורים שלי' },
          //   { path: `/${usernameForUrl}/pending-requests`, label: 'בקשות ממתינות'},
          //   { path: `/${usernameForUrl}/profile`, label: 'הפרופיל שלי'}
        ];
      case 1: // מנהל מערכת
        return [
          { path: `/${usernameForUrl}/admin`, label: 'ניהול מערכת' },
          { path: `/${usernameForUrl}/register-lesson`, label: 'רישום לשיעור חדש' },
          //   { path: `/${usernameForUrl}/profile`, label: 'הפרופיל שלי' }
          //   { path: `/${usernameForUrl}/students`, label: 'ניהול תלמידים', icon: '👥' },
          //   { path: `/${usernameForUrl}/teachers`, label: 'ניהול מורים'},
          //   { path: `/${usernameForUrl}/pools`, label: 'ניהול בריכות' },
          //   { path: `/${usernameForUrl}/general`, label: 'ניהול כללי', icon: '⚙️' },
          //   { path: `/${usernameForUrl}/profile`, label: 'הפרופיל שלי', icon: '👤' }
        ];
      default:
        return [{ path: '/profile', label: 'הפרופיל שלי', icon: '👤' }];
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="user-dashboard-container" ref={dropdownRef}>
      <button
        className="user-dashboard-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="welcome-text">
          שלום, {userData.name}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="user-dashboard-menu">
          {getUserMenuItems().map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="dashboard-item"
              onClick={() => setIsOpen(false)}
            >
              <span className="item-text">{item.label}</span>
              <span className="item-icon">{item.icon}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
