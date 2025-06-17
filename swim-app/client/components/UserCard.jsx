import React from 'react';
import '../styles/UserCard.css';

function UserCard({ user, userType }) {
  const handleCardClick = () => {
    // בהמשך נוסיף כאן לוגיקה לצפייה בשיעורים
    console.log(`Clicked on ${user.name}`);
  };

  const cardClass = `user-card ${userType === 'students' ? 'student-card' : 'teacher-card'}`;

  return (
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
          <span className="user-type">
            {userType === 'students' ? 'תלמיד' : 'מורה'}
          </span>
        </div>
      </div>
      
      <div className="user-actions">
        <span className="click-hint">לחץ לפרטים נוספים</span>
        <span className="arrow-icon">←</span>
      </div>
    </div>
  );
}

export default UserCard;
