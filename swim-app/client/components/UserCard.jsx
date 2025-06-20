import React, { useState } from 'react';
import '../styles/UserCard.css';

function UserCard({ user, userType }) {
  const [showLessonsModal, setShowLessonsModal] = useState(false);

  const handleCardClick = () => {
    console.log(`Clicked on ${user.name}`);
    setShowLessonsModal(true);
  };

  const closeModal = () => {
    setShowLessonsModal(false);
  };

  const cardClass = `user-card ${userType === 'students' ? 'student-card' : 'teacher-card'}`;

  // חישוב מספר השיעורים
  const lessonsCount = user.lessons ? user.lessons.length : 0;

  return (
    <>
      <div className={cardClass} onClick={handleCardClick}>
        <div className="user-info">
          <div className="user-avatar">
            <span className="avatar-icon">
              {userType === 'students' ? '🏊‍♂️' : '👨‍🏫'}
            </span>
          </div>

          <div className="user-details">
            <h3 className="user-name">{user.name}</h3>
            <p className="user-email">{user.email}</p>
            {/* הצגת מספר השיעורים */}
            <p className="lessons-count">
              שיעורים: {lessonsCount}
            </p>
          </div>
        </div>

        <div className="user-actions">
          <span className="click-hint">פרטים נוספים</span>
        </div>
      </div>
  

      {/* Modal מעוצב פשוט ונקי */}
      {showLessonsModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>שיעורים של {user.name}</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              {lessonsCount === 0 ? (
                <p>אין שיעורים רשומים</p>
              ) : (
                <div className="lessons-list">
                  {user.lessons.map((lesson) => (
                    <div key={lesson.lesson_id} className="lesson-item">
                      <div className="lesson-header">
                        <h4>שיעור #{lesson.lesson_id}</h4>
                        <span className="lesson-type">{lesson.lesson_type}</span>
                      </div>

                      <div className="lesson-details">
                        <p><strong>תאריך:</strong> {new Date(lesson.lesson_date).toLocaleDateString('he-IL')}</p>
                        <p><strong>שעה:</strong> {lesson.start_time} - {lesson.end_time}</p>
                        <p><strong>בריכה:</strong> {lesson.pool_name}</p>
                        <p><strong>רמה:</strong> {lesson.level}</p>
                        <p><strong>גילאים:</strong> {lesson.min_age}-{lesson.max_age}</p>
                        <p><strong>משתתפים:</strong> {lesson.num_registered}/{lesson.max_participants}</p>

                        {userType === 'students' && lesson.registration_date && (
                          <p><strong>הרשמה:</strong> {new Date(lesson.registration_date).toLocaleDateString('he-IL')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default UserCard;
