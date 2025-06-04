import React, { useContext } from 'react';
import { Routes, Route, NavLink, useParams } from 'react-router-dom';
import { userContext } from './App';
import MyLessons from './MyLessons';
// import RegisterLesson from './RegisterLesson';
import Profile from './Profile';
import '../styles/UserDashboard.css';

function UserDashboard() {
  const { userData } = useContext(userContext);
  const { username } = useParams();

  // פונקציה לקבלת תפריט לפי סוג משתמש
  const getUserMenuItems = () => {
    if (!userData) return [];

    const usernameForUrl = userData.name.toLowerCase().replace(/\s+/g, '-');

    switch (userData.type_id) {
      case 2: // תלמיד
        return [
          { path: `/${usernameForUrl}/my-lessons`, label: 'השיעורים שלי', icon: '📚' },
        //   { path: `/${usernameForUrl}/register-lesson`, label: 'רישום לשיעור חדש', icon: '➕' },
        //   { path: `/${usernameForUrl}/profile`, label: 'הפרופיל שלי', icon: '👤' }
        ];
      case 3: // מורה
        return [
          { path: `/${usernameForUrl}/my-lessons`, label: 'השיעורים שלי', icon: '📚' },
        //   { path: `/${usernameForUrl}/pending-requests`, label: 'בקשות ממתינות', icon: '⏳' },
        //   { path: `/${usernameForUrl}/profile`, label: 'הפרופיל שלי', icon: '👤' }
        ];
      case 1: // מנהל מערכת
        return [
        //   { path: `/${usernameForUrl}/students`, label: 'ניהול תלמידים', icon: '👥' },
        //   { path: `/${usernameForUrl}/teachers`, label: 'ניהול מורים', icon: '👨‍🏫' },
        //   { path: `/${usernameForUrl}/pools`, label: 'ניהול בריכות', icon: '🏊‍♂️' },
        //   { path: `/${usernameForUrl}/general`, label: 'ניהול כללי', icon: '⚙️' },
        //   { path: `/${usernameForUrl}/profile`, label: 'הפרופיל שלי', icon: '👤' }
        ];
      default:
        return [{ path: '/profile', label: 'הפרופיל שלי', icon: '👤' }];
    }
  };

  const getUserTypeLabel = () => {
    switch (userData?.type_id) {
      case 1: return 'מנהל מערכת';
      case 2: return 'תלמיד';
      case 3: return 'מורה';
      default: return 'משתמש';
    }
  };

  if (!userData) {
    return (
      <div className="user-dashboard">
        <div className="dashboard-container">
          <h1>אין גישה</h1>
          <p>אנא התחבר כדי לגשת לדף זה</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>ברוך הבא, {userData.name}</h1>
          <p className="user-type">{getUserTypeLabel()}</p>
        </div>

        <div className="dashboard-content">
          <nav className="dashboard-nav">
            <h3>התפריט שלי</h3>
            <div className="nav-items">
              {getUserMenuItems().map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className="nav-item"
                >
                  <span className="item-icon">{item.icon}</span>
                  <span className="item-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          <main className="dashboard-main">
            <Routes>
              <Route path="my-lessons" element={<MyLessons />} />
              {/* <Route path="register-lesson" element={<RegisterLesson />} /> */}
              <Route path="profile" element={<Profile />} />
              {/* נתיבים נוספים למורים ומנהלים */}
              <Route path="pending-requests" element={<div>בקשות ממתינות - בפיתוח</div>} />
              <Route path="students" element={<div>ניהול תלמידים - בפיתוח</div>} />
              <Route path="teachers" element={<div>ניהול מורים - בפיתוח</div>} />
              <Route path="pools" element={<div>ניהול בריכות - בפיתוח</div>} />
              <Route path="general" element={<div>ניהול כללי - בפיתוח</div>} />
              <Route path="*" element={<div className="welcome-message">בחר אפשרות מהתפריט</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
