import React from 'react';
import '../styles/HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage">
            <section className="hero-section">
                <div className="hero-video-container">
                    <div className="hero-video-placeholder"></div>
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h1 className="hero-title">בריכה אחת, הרבה חיוכים – שיעורי שחייה שמנוהלים בחוכמה.</h1>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <div className="container">
                    <div className="steps-container">
                        <p className="steps-subtitle">למד לשחות עם המורים הטובים ביותר במתקנים המתקדמים</p>
                        <div className="hero-steps">
                            <div className="step">
                                <span className="step-number">1</span>
                                <span className="step-text">בוחרים בריכה</span>
                            </div>
                            <div className="step-arrow">←</div>
                            <div className="step">
                                <span className="step-number">2</span>
                                <span className="step-text">בוחרים שיעור</span>
                            </div>
                            <div className="step-arrow">←</div>
                            <div className="step">
                                <span className="step-number">3</span>
                                <span className="step-text">שוחים!</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">למה לבחור בנו?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🏊‍♂️</div>
                            <h3>מורים מקצועיים</h3>
                            <p>צוות מורים מנוסה ומוסמך עם שנות ניסיון רבות</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏊‍♀️</div>
                            <h3>מתקנים מתקדמים</h3>
                            <p>בריכות מודרניות עם ציוד מתקדם ותחזוקה מעולה</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏆</div>
                            <h3>הישגים מוכחים</h3>
                            <p>אלפי תלמידים מרוצים שלמדו לשחות בהצלחה</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">+500</span>
                            <span className="stat-label">תלמידים פעילים</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">+25</span>
                            <span className="stat-label">מורים מקצועיים</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">8</span>
                            <span className="stat-label">סניפים</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">+10</span>
                            <span className="stat-label">שנות ניסיון</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
