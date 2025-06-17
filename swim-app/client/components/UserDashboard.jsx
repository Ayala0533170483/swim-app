import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userContext } from './App';
import '../styles/UserDashboard.css';

function UserDashboard() {
  const { userData } = useContext(userContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const getUserMenuItems = () => {
    if (!userData) return [];

    const usernameForUrl = userData.name.toLowerCase().replace(/\s+/g, '-');

    switch (userData.type_name) {
      case "student":
        return [
          { path: `/${usernameForUrl}/my-lessons`, label: 'השיעורים שלי' },
          { path: `/${usernameForUrl}/register-lesson`, label: 'רישום לשיעור חדש' },
          { path: `/${usernameForUrl}`, label: 'הפרופיל שלי' }

        ];
      case "teacher":
        return [
          { path: `/${usernameForUrl}/my-lessons`, label: 'השיעורים שלי' },
          { path: `/${usernameForUrl}/requests`, label: 'בקשות ממתינות' },
          { path: `/${usernameForUrl}`, label: 'הפרופיל שלי' }
        ];
      case "admin":
        return [
          { path: `/${usernameForUrl}`, label: 'הפרופיל שלי' },
          { path: `/${usernameForUrl}/teachers`, label: 'ניהול מורים' },
          { path: `/${usernameForUrl}/students`, label: 'ניהול תלמידים' },
          { path: `/${usernameForUrl}/pools`, label: 'ניהול בריכות' },
          { path: `/${usernameForUrl}/management`, label: 'ניהול כללי' }

        ];
      default:
        return [{ path: '/profile', label: 'הפרופיל שלי' }];
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
