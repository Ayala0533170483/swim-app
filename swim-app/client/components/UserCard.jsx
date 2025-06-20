import React from 'react';
import '../styles/UserCard.css';

function UserCard({ user, userType }) {
  const handleCardClick = () => {
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
        </div>
      </div>

      <div className="user-actions">
        <span className="click-hint">פרטים נוספים</span>
      </div>
    </div>
  );
}

export default UserCard;
