import React, { useState } from 'react';
import Update from './Update';
import DeleteItem from './DeleteItem';
import { updateKeys, validationRules } from '../structures/PoolCardStructure';
import '../styles/UserCard.css';

function PoolCard({ pool, updateDisplay, deleteDisplay, setDisplayChanged }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    console.log(`Clicked on pool: ${pool.name}`);
  };

  return (
    <div className={`user-card pool-card ${isExpanded ? 'expanded' : ''}`}>
      {/* החלק הבסיסי - תמיד נראה */}
      <div className="user-info" onClick={handleCardClick}>
        <div className="user-avatar">
          <span className="avatar-icon">🏊‍♂️</span>
        </div>

        <div className="user-details">
          <h3 className="user-name">{pool.name}</h3>
          <p className="user-email">{pool.city}</p>
          <span className="user-type">בריכה</span>
        </div>
      </div>

      {/* החלק הבסיסי של הפעולות - תמיד נראה */}
      <div className="user-actions" onClick={handleCardClick}>
        <span className="click-hint">
          {isExpanded ? 'סגירת הפרטים' : 'פרטים נוספים'}
        </span>
      </div>

      {/* פרטים מורחבים - רק כשמורחב */}
      {isExpanded && (
        <div className="expanded-details">
          <div className="pool-details">
            <h4>פרטי הבריכה:</h4>

            {pool.address && (
              <div className="detail-item">
                <span className="detail-label">כתובת:</span>
                <span className="detail-value">{pool.address}</span>
              </div>
            )}

            {pool.phone && (
              <div className="detail-item">
                <span className="detail-label">טלפון:</span>
                <span className="detail-value">📞 {pool.phone}</span>
              </div>
            )}

            {pool.description && (
              <div className="detail-item">
                <span className="detail-label">תיאור:</span>
                <span className="detail-value">{pool.description}</span>
              </div>
            )}

            {(!pool.address && !pool.phone && !pool.description && !pool.latitude) && (
              <p className="no-additional-details">אין פרטים נוספים</p>
            )}
          </div>

          <div className="action-buttons">
            <button className="pool-action-btn edit-btn">
              <Update
                item={{ ...pool, id: pool.pool_id }}
                type="pools"
                updateDisplay={updateDisplay}
                setDisplayChanged={setDisplayChanged}
                keys={updateKeys}
                validationRules={validationRules}
              />
              ערוך פרטים
            </button>

            <DeleteItem
              id={pool.pool_id}
              type="pools"
              deleteDisplay={deleteDisplay}
              setDisplayChanged={setDisplayChanged}
              className="pool-action-btn delete-btn"
              text="מחק בריכה"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PoolCard;
