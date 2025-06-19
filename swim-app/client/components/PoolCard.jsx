import React, { useState } from 'react';
import Update from './Update';
import DeleteItem from './DeleteItem';
import { updateKeys, validationRules, getImageUrl } from '../structures/PoolCardStructure';
import '../styles/UserCard.css';

function PoolCard({ pool, updateDisplay, deleteDisplay, setDisplayChanged }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    console.log(`Clicked on pool: ${pool.name}`);
  };

  // 🎯 בואו נבדוק מה יש בנתונים
  console.log('🔍 Pool data:', pool);
  console.log('🔍 Image path:', pool.image_path);

  const imageUrl = getImageUrl(pool.image_path);
  console.log('🔍 Generated image URL:', imageUrl);

  return (
    <div className={`user-card pool-card ${isExpanded ? 'expanded' : ''}`}>
      {/* החלק הבסיסי - תמיד נראה */}
      <div className="user-info" onClick={handleCardClick}>
        <div className="user-avatar pool-avatar">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={pool.name}
                className="pool-image"
                onLoad={() => console.log('✅ Image loaded:', imageUrl)}
                onError={(e) => {
                  console.log('❌ Image failed to load:', imageUrl);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="pool-placeholder"
                style={{ display: 'none' }}
              >
                <span className="pool-icon">🏊‍♂️</span>
                <small>{pool.name}</small>
              </div>
            </>
          ) : (
            <div className="pool-placeholder">
              <span className="pool-icon">🏊‍♂️</span>
              <small>אין תמונה</small>
            </div>
          )}
        </div>

        <div className="user-details pool-details-main">
          <h3 className="user-name">{pool.name}</h3>
          <p className="user-email">{pool.city}</p>
          {pool.phone && (
            <p className="pool-phone-preview">📞 {pool.phone}</p>
          )}
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
