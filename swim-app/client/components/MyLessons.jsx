import React, { useContext, useState, useEffect } from 'react';
import { userContext } from './App';
import '../styles/MyLessons.css';

function MyLessons() {
  const { userData } = useContext(userContext);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      fetchUserLessons();
    }
  }, [userData]);

  const fetchUserLessons = async () => {
    try {
      // כאן תשלח בקשה לשרת לקבל את השיעורים של המשתמש
      // const response = await fetch(`/api/users/${userData.id}/lessons`);
      // const data = await response.json();
      // setLessons(data);
      
      // לעת עתה - דמה נתונים
      const mockLessons = [
        {
          id: 1,
          date: '2024-01-15',
          time: '10:00',
          instructor: 'יוסי כהן',
          pool: 'בריכה מרכזית',
          status: 'confirmed'
        },
        {
          id: 2,
          date: '2024-01-18',
          time: '14:00',
          instructor: 'שרה לוי',
          pool: 'בריכה צפונית',
          status: 'pending'
        }
      ];
      setLessons(mockLessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'מאושר';
      case 'pending': return 'ממתין לאישור';
      case 'cancelled': return 'בוטל';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (!userData) {
    return (
      <div className="my-lessons-page">
        <div className="container">
          <h1>אין גישה</h1>
          <p>אנא התחבר כדי לראות את השיעורים שלך</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-lessons-page">
      <div className="container">
        <div className="page-header">
          <h1>השיעורים שלי</h1>
          <p>ברוך הבא {userData.name}, כאן תוכל לראות את כל השיעורים שלך</p>
        </div>

        {loading ? (
          <div className="loading">טוען...</div>
        ) : (
          <div className="lessons-container">
            {lessons.length === 0 ? (
              <div className="no-lessons">
                <h3>אין לך שיעורים רשומים</h3>
                <p>לחץ על "רישום לשיעור חדש" כדי להירשם לשיעור</p>
              </div>
            ) : (
              <div className="lessons-grid">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="lesson-card">
                    <div className="lesson-header">
                      <h3>שיעור שחייה</h3>
                      <span className={`status ${getStatusClass(lesson.status)}`}>
                        {getStatusText(lesson.status)}
                      </span>
                    </div>
                    <div className="lesson-details">
                      <div className="detail-item">
                        <span className="label">תאריך:</span>
                        <span className="value">{lesson.date}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">שעה:</span>
                        <span className="value">{lesson.time}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">מדריך:</span>
                        <span className="value">{lesson.instructor}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">בריכה:</span>
                        <span className="value">{lesson.pool}</span>
                      </div>
                    </div>
                    <div className="lesson-actions">
                      <button className="btn btn-primary">פרטים</button>
                      {lesson.status === 'confirmed' && (
                        <button className="btn btn-secondary">ביטול</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLessons;
