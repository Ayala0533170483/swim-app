import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/About.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>מי אנחנו</h1>
          <p className="about-subtitle">בית הספר לשחייה המוביל בישראל</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <div className="about-text">
              <h2>הסיפור שלנו</h2>
              <p>
                בית הספר לשחייה שלנו נוסד בשנת 2013 מתוך חזון ברור - להפוך את השחייה לנגישה לכולם.
                אנחנו מאמינים שכל אדם יכול ללמוד לשחות, ללא קשר לגיל או לרמת הכושר הראשונית.
              </p>
              <p>
                במהלך השנים הצלחנו ללמד אלפי תלמידים לשחות, החל מתינוקות ועד למבוגרים.
                הגישה שלנו משלבת טכניקות הוראה מתקדמות עם סביבה תומכת ומעודדת.
              </p>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>🏊‍♂️ תמונת הצוות</span>
              </div>
            </div>
          </div>

          <div className="mission-section">
            <h2>המטרות שלנו</h2>
            <div className="mission-grid">
              <div className="mission-item">
                <h3>🎯 מקצועיות</h3>
                <p>להעניק הוראה מקצועית ברמה הגבוהה ביותר</p>
              </div>
              <div className="mission-item">
                <h3>🤝 נגישות</h3>
                <p>להפוך את השחייה לנגישה לכל הגילאים והרמות</p>
              </div>
              <div className="mission-item">
                <h3>🏆 הצלחה</h3>
                <p>לוודא שכל תלמיד משיג את המטרות שלו</p>
              </div>
              <div className="mission-item">
                <h3>💙 בטיחות</h3>
                <p>לשמור על סביבה בטוחה ומקצועית</p>
              </div>
            </div>
          </div>

          <div className="team-section">
            <h2>הצוות שלנו</h2>
            <p>
              הצוות שלנו מורכב ממורים מוסמכים ומנוסים, כולם בעלי הכשרה מקצועית והתמחות בהוראת שחייה.
              כל מורה עובר הכשרה מתמשכת ומתעדכן בשיטות ההוראה החדישות ביותר.
            </p>
            <div className="team-stats">
              <div className="team-stat">
                <span className="stat-number">25+</span>
                <span className="stat-label">מורים מוסמכים</span>
              </div>
              <div className="team-stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">שנות ניסיון</span>
              </div>
              <div className="team-stat">
                <span className="stat-number">5000+</span>
                <span className="stat-label">תלמידים מרוצים</span>
              </div>
              <div className="team-stat">
                <span className="stat-number">3</span>
                <span className="stat-label">סניפים פעילים</span>
              </div>
            </div>
          </div>

          <div className="values-section">
            <h2>הערכים שלנו</h2>
            <ul className="values-list">
              <li>מקצועיות ומצוינות בהוראה</li>
              <li>יחס אישי לכל תלמיד</li>
              <li>סביבה בטוחה ותומכת</li>
              <li>שקיפות ויושרה</li>
              <li>התפתחות מתמדת וחדשנות</li>
              <li>עבודת צוות ושיתוף פעולה</li>
            </ul>
          </div>

          <div className="cta-section">
            <h2>מוכנים להתחיל?</h2>
            <p>
              הצטרפו למשפחת השחייה שלנו ותגלו את הכיף והבריאות שבשחייה.
              אנחנו כאן כדי ללוות אתכם בכל צעד בדרך למימוש המטרות שלכם.
            </p>
            <div className="cta-buttons">
              <button 
                className="cta-button primary"
                onClick={() => navigate('/signup')}
              >
                הירשמו עכשיו
              </button>
              <button 
                className="cta-button secondary"
                onClick={() => navigate('/contact')}
              >
                צרו קשר
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
