import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Messages from './Messages';
import '../styles/Management.css';

function Management() {
  const navigate = useNavigate();
  const location = useLocation();

  // קובע לפי הנתיב איזה חלק להציג
  const path = location.pathname;
  const activeSection = path.endsWith('/messages') ? 'messages' : 'overview';

  const renderContent = () => {
    switch (activeSection) {
      case 'messages':
        return <Messages />;
      case 'overview':
      default:
        return (
          <div className="management-overview">
            <h2>ניהול כללי</h2>
            <div className="management-options">
              <div
                className="management-card"
                onClick={() => navigate('/management/messages')}
              >
                <h3>הודעות צור קשר</h3>
                <p>צפייה וניהול הודעות מלקוחות</p>
              </div>

              <div className="management-card disabled">
                <h3>שליחת הודעות</h3>
                <p>שליחת הודעות לכל המשתמשים</p>
                <span className="coming-soon">בקרוב</span>
              </div>

              <div className="management-card disabled">
                <h3>דוחות</h3>
                <p>דוחות פעילות ונתונים</p>
                <span className="coming-soon">בקרוב</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="management-container">
      {activeSection !== 'overview' && (
        <div className="back-navigation">
          <button className="back-btn" onClick={() => navigate('/management')}>
            ← חזור לניהול כללי
          </button>
        </div>
      )}

      {renderContent()}
    </div>
  );
}

export default Management;
