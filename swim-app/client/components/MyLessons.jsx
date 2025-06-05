import React, { useContext, useState, useEffect } from 'react';
import { userContext } from './App';
import AddItem from './AddItem';
import '../styles/MyLessons.css';

function MyLessons() {
  const { userData } = useContext(userContext);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pools, setPools] = useState([]);

  // בדיקה אם המשתמש הוא מורה
  const isTeacher = userData?.type_id === 2;

  // מפתחות השדות לטופס הוספת שיעור
const lessonKeys = [
    'בריכה',
    'תאריך השיעור', 
    'שעת התחלה',
    'שעת סיום',
    'סוג השיעור',
    'מקסימום משתתפים',
    'טווח גילאים',
    'רמת השיעור'
  ];

  // ערכי ברירת מחדל לטופס
  const defaultLessonValues = {
    pool_id: '',
    lesson_date: '',
    start_time: '',
    end_time: '',
    lesson_type: 'private',
    max_participants: 1,
    age_range: '',
    level: 'beginner'
  };

  // סטיילים מותאמים לטופס הוספת שיעור
  const customStyles = {
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      marginBottom: '20px'
    },
    container: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #dee2e6',
      marginBottom: '20px'
    },
    field: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#495057'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      fontSize: '14px'
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    sendButton: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    cancelButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }
  };


  const handleAddLesson = (newLesson) => {
    setLessons(prevLessons => [...prevLessons, newLesson]);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'confirmed';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'מאושר';
      case 'pending': return 'ממתין לאישור';
      case 'cancelled': return 'מבוטל';
      default: return 'לא ידוע';
    }
  };

  if (!userData) {
    return <div className="loading">טוען נתוני משתמש...</div>;
  }

  return (
    <div className="my-lessons-page">
      <div className="container">
        <div className="page-header">
          <h1>{isTeacher ? 'השיעורים שלי כמורה' : 'השיעורים שלי'}</h1>
          <p>ברוך הבא {userData.name}, כאן תוכל לראות את כל השיעורים שלך</p>
        </div>

        {/* כפתור הוספת שיעור למורים בלבד */}
        {isTeacher && (
          <div className="teacher-actions">
            <AddItem
              keys={lessonKeys}
              type="lessons"
              role={userData.type_name}
              addDisplay={handleAddLesson}
              defaltValues={defaultLessonValues}
              buttonText="הוספת שיעור חדש"
              buttonClassName="add-lesson-button"
              containerClassName="add-lesson-container"
              customStyles={customStyles}
            />
          </div>
        )}

        {loading ? (
          <div className="loading">טוען...</div>
        ) : (
          <div className="lessons-container">
            {lessons.length === 0 ? (
              <div className="no-lessons">
                <h3>{isTeacher ? 'אין לך שיעורים שנוצרו' : 'אין לך שיעורים רשומים'}</h3>
                <p>
                  {isTeacher 
                    ? 'לחץ על "הוספת שיעור חדש" כדי ליצור שיעור חדש'
                    : 'לחץ על "רישום לשיעור חדש" כדי להירשם לשיעור'
                  }
                </p>
              </div>
            ) : (
              <div className="lessons-grid">
                {lessons.map(lesson => (
                  <div key={lesson.lesson_id} className="lesson-card">
                    <div className="lesson-header">
                      <h3>שיעור שחייה - {lesson.lesson_type === 'private' ? 'פרטי' : 'קבוצתי'}</h3>
                      <span className={`status ${getStatusClass(lesson.is_confirmed ? 'confirmed' : 'pending')}`}>
                        {getStatusText(lesson.is_confirmed ? 'confirmed' : 'pending')}
                      </span>
                    </div>
                    <div className="lesson-details">
                      <div className="detail-item">
                        <span className="label">תאריך:</span>
                        <span className="value">{new Date(lesson.lesson_date).toLocaleDateString('he-IL')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">שעה:</span>
                        <span className="value">{lesson.start_time} - {lesson.end_time}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">בריכה:</span>
                        <span className="value">{lesson.pool_name || `בריכה ${lesson.pool_id}`}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">רמה:</span>
                        <span className="value">{lesson.level}</span>
                      </div>
                      {lesson.lesson_type === 'group' && (
                        <div className="detail-item">
                          <span className="label">מקסימום משתתפים:</span>
                          <span className="value">{lesson.max_participants}</span>
                        </div>
                      )}
                      {lesson.age_range && (
                        <div className="detail-item">
                          <span className="label">טווח גילאים:</span>
                          <span className="value">{lesson.age_range}</span>
                        </div>
                      )}
                    </div>
                    <div className="lesson-actions">
                      <button className="btn btn-primary">פרטים</button>
                      {lesson.is_confirmed && (
                        <button className="btn btn-secondary">
                          {isTeacher ? 'עריכה' : 'ביטול'}
                        </button>
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
