import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../styles/NotFound.css"; 

function Error() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('no-scroll');
    
    const container = document.querySelector('.errorContainer');
    if (container) {
      const bubblesContainer = document.createElement('div');
      bubblesContainer.className = 'floating-bubbles';
      
      for (let i = 0; i < 6; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubblesContainer.appendChild(bubble);
      }
      
      container.appendChild(bubblesContainer);
      
      return () => {
        document.body.classList.remove('no-scroll');
        if (container.contains(bubblesContainer)) {
          container.removeChild(bubblesContainer);
        }
      };
    }
    
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="errorContainer">
      <div className="errorContent">
        <div className="errorAnimation">
          <div className="error404">404</div>
          
          <div className="swimming-pool">
            <div className="swimmer">🏊‍♂️</div>
          </div>
        </div>

        <h1 className="error-title">אופס! הדף שחה משם...</h1>
        <p className="error-subtitle">
          נראה שהדף שאתה מחפש צלל עמוק מדי ולא מצאנו אותו בבריכה שלנו
        </p>
        <p className="error-message">
          אל תדאג! אנחנו כאן לעזור לך למצוא את הדרך חזרה למים הבטוחים
        </p>

        <div className="error-actions">
          <button 
            className="btn btnPrimary" 
            onClick={handleGoHome}
          >
            <span className="btn-icon">🏠</span>
            חזרה לעמוד הבית
          </button>
          
          <button 
            className="btn btnSecondary" 
            onClick={handleGoBack}
          >
            <span className="btn-icon">↩️</span>
            חזרה לדף הקודם
          </button>
        </div>
      </div>
    </div>
  );
}

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
