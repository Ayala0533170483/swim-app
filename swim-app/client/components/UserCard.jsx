import React, { useState } from 'react';
import {
  getLessonDisplayFields,
  formatLessonValue,
  processLessonForDisplay
} from '../structures/userLessonsDisplayStructure';
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
  const lessonsCount = user.lessons ? user.lessons.length : 0;

  const displayFields = getLessonDisplayFields(userType);

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
            <p className="lessons-count">
              שיעורים: {lessonsCount}
            </p>
          </div>
        </div>

        <div className="user-actions">
          <span className="click-hint">פרטים נוספים</span>
        </div>
      </div>

      {/* Modal עם תצוגה מובנית */}
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
                  {user.lessons.map((lesson, index) => {
                    const processedLesson = processLessonForDisplay(lesson);

                    return (
                      <div key={lesson.lesson_id} className="lesson-item">
                        <div className="lesson-header">
                          <h4>שיעור {index + 1}</h4>
                          <span className="lesson-type">
                            {formatLessonValue('lesson_type', lesson.lesson_type)}
                          </span>
                        </div>

                        <div className="lesson-details">
                          {displayFields.map(field => (
                            <p key={field.key}>
                              <strong>{field.label}:</strong> {formatLessonValue(field.key, processedLesson[field.key])}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
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
