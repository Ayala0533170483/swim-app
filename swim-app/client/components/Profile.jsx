import React, { useContext, useState, useEffect } from 'react';
import { userContext } from './App';
import '../styles/Profile.css';

function Profile() {
  const { userData, setUserData } = useContext(userContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    emergencyContact: '',
    medicalNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        birthDate: userData.birthDate || '',
        emergencyContact: userData.emergencyContact || '',
        medicalNotes: userData.medicalNotes || ''
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // כאן תשלח בקשה לשרת לעדכון הפרטים
      // const response = await fetch(`/api/users/${userData.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });
      
      // לעת עתה - סימולציה של שמירה
      setTimeout(() => {
        const updatedUserData = { ...userData, ...formData };
        setUserData(updatedUserData);
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        setIsEditing(false);
        setMessage('הפרטים נשמרו בהצלחה!');
        setLoading(false);
        
        // הסתר הודעה אחרי 3 שניות
        setTimeout(() => setMessage(''), 3000);
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('שגיאה בשמירת הפרטים');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // החזר את הנתונים המקוריים
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      birthDate: userData.birthDate || '',
      emergencyContact: userData.emergencyContact || '',
      medicalNotes: userData.medicalNotes || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  const getUserTypeText = (typeId) => {
    switch (typeId) {
      case 1: return 'מנהל מערכת';
      case 2: return 'תלמיד';
      case 3: return 'מורה';
      default: return 'לא מוגדר';
    }
  };

  if (!userData) {
    return (
      <div className="profile-page">
        <div className="container">
          <h1>אין גישה</h1>
          <p>אנא התחבר כדי לראות את הפרופיל שלך</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>הפרופיל שלי</h1>
          <div className="profile-actions">
            {!isEditing ? (
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                ערוך פרטים
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'שומר...' : 'שמור'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  ביטול
                </button>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('שגיאה') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-section">
            <h2>פרטים אישיים</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>שם מלא:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span className="field-value">{userData.name}</span>
                )}
              </div>

              <div className="profile-field">
                <label>אימייל:</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span className="field-value">{userData.email}</span>
                )}
              </div>

              <div className="profile-field">
                <label>טלפון:</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span className="field-value">{userData.phone || 'לא הוזן'}</span>
                )}
              </div>

              <div className="profile-field">
                <label>כתובת:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span className="field-value">{userData.address || 'לא הוזנה'}</span>
                )}
              </div>

              <div className="profile-field">
                <label>תאריך לידה:</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span className="field-value">{userData.birthDate || 'לא הוזן'}</span>
                )}
              </div>

              <div className="profile-field">
                <label>איש קשר לחירום:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span className="field-value">{userData.emergencyContact || 'לא הוזן'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>מידע נוסף</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>סוג משתמש:</label>
                <span className="field-value">{getUserTypeText(userData.type_id)}</span>
              </div>

              <div className="profile-field full-width">
                <label>הערות רפואיות:</label>
                {isEditing ? (
                  <textarea
                    name="medicalNotes"
                    value={formData.medicalNotes}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="הזן הערות רפואיות רלוונטיות..."
                  />
                ) : (
                  <span className="field-value">{userData.medicalNotes || 'אין הערות'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
