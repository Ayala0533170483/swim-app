import React, { useState } from 'react';
import '../styles/Branches.css';

function BranchesPage() {
  const [selectedBranch, setSelectedBranch] = useState(null);

  const branches = [
    {
      id: 1,
      name: "סניף תל אביב",
      address: "רחוב הירקון 123, תל אביב",
      phone: "03-1234567",
      email: "telaviv@swimschool.co.il",
      hours: "ראשון-חמישי: 06:00-22:00, שישי: 06:00-16:00, שבת: 08:00-20:00",
      facilities: ["בריכה אולימפית", "בריכת ילדים", "ג'קוזי", "סאונה", "חדר כושר"],
      image: "tel-aviv-branch.jpg"
    },
    {
      id: 2,
      name: "סניף חיפה",
      address: "שדרות בן גוריון 456, חיפה",
      phone: "04-7654321",
      email: "haifa@swimschool.co.il",
      hours: "ראשון-חמישי: 06:00-22:00, שישי: 06:00-15:00, שבת: 08:00-20:00",
      facilities: ["בריכה אולימפית", "בריכת ילדים", "ג'קוזי", "חדר כושר"],
      image: "haifa-branch.jpg"
    },
    {
      id: 3,
      name: "סניף ירושלים",
      address: "רחוב יפו 789, ירושלים",
      phone: "02-9876543",
      email: "jerusalem@swimschool.co.il",
      hours: "ראשון-חמישי: 06:00-22:00, שישי: 06:00-14:00, שבת: 20:00-23:00",
      facilities: ["בריכה אולימפית", "בריכת ילדים", "סאונה", "חדר כושר", "מגרש כדורמים"],
      image: "jerusalem-branch.jpg"
    }
  ];

  return (
    <div className="branches-page">
      <div className="container">
        <div className="branches-header">
          <h1>הסניפים שלנו</h1>
          <p>מצא את הסניף הקרוב אליך והצטרף למשפחת השחייה שלנו</p>
        </div>

        <div className="branches-grid">
          {branches.map((branch) => (
            <div 
              key={branch.id} 
              className={`branch-card ${selectedBranch === branch.id ? 'selected' : ''}`}
              onClick={() => setSelectedBranch(selectedBranch === branch.id ? null : branch.id)}
            >
              <div className="branch-image">
                <div className="image-placeholder">
                  🏊‍♂️ תמונת הסניף
                </div>
              </div>
              
              <div className="branch-content">
                <h2 className="branch-name">{branch.name}</h2>
                
                <div className="branch-info">
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <span className="info-text">{branch.address}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-icon">📞</span>
                    <span className="info-text">{branch.phone}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-icon">✉️</span>
                    <span className="info-text">{branch.email}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-icon">🕒</span>
                    <span className="info-text">{branch.hours}</span>
                  </div>
                </div>

                {selectedBranch === branch.id && (
                  <div className="branch-details">
                    <h3>מתקנים זמינים:</h3>
                    <div className="facilities-list">
                      {branch.facilities.map((facility, index) => (
                        <span key={index} className="facility-tag">
                          {facility}
                        </span>
                      ))}
                    </div>
                    
                    <div className="branch-actions">
                      <button className="btn-primary">הזמן שיעור ניסיון</button>
                      <button className="btn-secondary">הוראות הגעה</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="map-section">
          <h2>מפת הסניפים</h2>
          <div className="map-placeholder">
            <div className="map-content">
              🗺️ כאן תוצג מפה אינטראקטיבית עם מיקום כל הסניפים
              <p>ניתן להוסיף Google Maps או מפה אחרת</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BranchesPage;
