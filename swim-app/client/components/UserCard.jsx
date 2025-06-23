import React, { useState } from 'react';
import { processLessonForDisplay, lessonDisplayValues } from '../structures/userLessonsDisplayStructure';
import DeleteItem from './DeleteItem';
import { FaEye, FaTrash } from 'react-icons/fa';
import '../styles/UserCard.css';

function UserCard({ user, userType, onUserDeleted }) {
  const [showLessonsModal, setShowLessonsModal] = useState(false);

  const handleViewLessons = (e) => {
    e.stopPropagation();
    setShowLessonsModal(true);
  };

  const closeModal = () => {
    setShowLessonsModal(false);
  };

  const handleUserDelete = (deletedUserId) => {
    if (onUserDeleted) {
      onUserDeleted(deletedUserId);
    }
  };

  const cardClass = `user-card ${userType === 'students' ? 'student-card' : 'teacher-card'}`;
  const lessonsCount = user.lessons ? user.lessons.length : 0;

  return (
    <>
      <div className={cardClass}>
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
              {lessonsCount} שיעורים
            </p>
          </div>
        </div>

        <div className="user-actions">
          <button className="action-button view-button" onClick={handleViewLessons}>
            <FaEye className="action-icon" />
            <span>צפה בשיעורים</span>
          </button>

          <DeleteItem
            id={user.user_id}
            type="users"
            deleteDisplay={handleUserDelete}
            nameButton="מחק משתמש"
            additionalData={{ userType: userType }}
          />
        </div>
      </div>

      {/* שאר הקוד של המודל נשאר זהה... */}
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
                    const displayLesson = processLessonForDisplay(lesson);

                    return (
                      <div key={lesson.lesson_id} className="lesson-item">
                        <div className="lesson-header">
                          <h4>שיעור {index + 1}</h4>
                          <span className="lesson-type">
                            {displayLesson.lesson_type}
                          </span>
                        </div>

                        <div className="lesson-details">
                          <p><strong>תאריך:</strong> {displayLesson.lesson_date}</p>
                          <p><strong>שעות:</strong> {displayLesson.time_range}</p>
                          <p><strong>בריכה:</strong> {displayLesson.pool_name}</p>
                          <p><strong>רמה:</strong> {displayLesson.level}</p>
                          <p><strong>גילאים:</strong> {displayLesson.age_range}</p>
                          <p><strong>משתתפים:</strong> {displayLesson.participants_info}</p>

                          {userType === 'students' && displayLesson.registration_date && (
                            <p><strong>תאריך הרשמה:</strong> {displayLesson.registration_date}</p>
                          )}
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