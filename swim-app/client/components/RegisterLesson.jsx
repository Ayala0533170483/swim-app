import React, { useState, useEffect, useContext } from 'react';
import { userContext } from './App';
import { fetchData } from '../js-files/GeneralRequests';
// import '../styles/RegisterLesson.css';

function RegisterLesson() {
    const { userData } = useContext(userContext);
    const [availableLessons, setAvailableLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        lessonType: 'all',
        level: 'all',
        poolId: 'all'
    });

    useEffect(() => {
        loadAvailableLessons();
    }, []);

    const loadAvailableLessons = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Loading available lessons...');
            
               const response = await fetchData('lessons', '', handleError);
        console.log('Response from server:', response);
            
            const lessons = response?.data || response || [];
            setAvailableLessons(lessons);
            console.log('Available lessons loaded:', lessons.length);
            
        } catch (err) {
            console.error('Error loading lessons:', err);
            setError('שגיאה בטעינת השיעורים');
        } finally {
            setLoading(false);
        }
    };

    const handleError = (type, error) => {
        console.error(`${type}:`, error);
        setError('שגיאה בטעינת הנתונים');
    };

    const handleRegisterToLesson = async (lessonId) => {
        try {
            console.log(`Registering to lesson ${lessonId}`);
            alert('הרישום לשיעור יתווסף בשלב הבא');
        } catch (err) {
            console.error('Error registering to lesson:', err);
            alert('שגיאה ברישום לשיעור');
        }
    };

    const filteredLessons = availableLessons.filter(lesson => {
        if (filter.lessonType !== 'all' && lesson.lesson_type !== filter.lessonType) return false;
        if (filter.level !== 'all' && lesson.level !== filter.level) return false;
        if (filter.poolId !== 'all' && lesson.pool_id !== parseInt(filter.poolId)) return false;
        return true;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL');
    };

    const formatTime = (timeString) => {
        return timeString?.substring(0, 5);
    };

    const translateLessonType = (type) => {
        switch (type?.toLowerCase()) {
            case 'private': return 'פרטי';
            case 'group': return 'קבוצתי';
            default: return 'לא מוגדר';
        }
    };

    const translateLevel = (level) => {
        switch (level?.toLowerCase()) {
            case 'beginner': return 'מתחיל';
            case 'intermediate': return 'בינוני';
            case 'advanced': return 'מתקדם';
            default: return 'כללי';
        }
    };

    const getLevelColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'beginner': return '#28a745';
            case 'intermediate': return '#ffc107';
            case 'advanced': return '#dc3545';
            default: return '#0066cc';
        }
    };

    const getLessonIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'private': return '👤';
            case 'group': return '👥';
            default: return '🏊‍♀️';
        }
    };

    if (!userData) {
        return <div className="register-lesson-container">יש להתחבר כדי לראות שיעורים זמינים</div>;
    }

    if (loading) {
        return <div className="register-lesson-container">טוען שיעורים...</div>;
    }

    if (error) {
        return (
            <div className="register-lesson-container">
                <div className="error">{error}</div>
                <button onClick={loadAvailableLessons}>נסה שוב</button>
            </div>
        );
    }

    return (
        <div className="register-lesson-container">
            <div className="page-header">
                <h1>רישום לשיעור חדש</h1>
                <p>בחר שיעור מהרשימה להירשם אליו</p>
            </div>

            {/* פילטרים */}
            <div className="filters-section">
                <div className="filter-group">
                    <label>סוג שיעור:</label>
                    <select 
                        value={filter.lessonType} 
                        onChange={(e) => setFilter({...filter, lessonType: e.target.value})}
                    >
                        <option value="all">הכל</option>
                        <option value="group">קבוצתי</option>
                        <option value="private">פרטי</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>רמה:</label>
                    <select 
                        value={filter.level} 
                        onChange={(e) => setFilter({...filter, level: e.target.value})}
                    >
                        <option value="all">הכל</option>
                        <option value="beginner">מתחיל</option>
                        <option value="intermediate">בינוני</option>
                        <option value="advanced">מתקדם</option>
                    </select>
                </div>
            </div>

            <div className="lessons-grid">
                {filteredLessons.length === 0 ? (
                    <div className="no-lessons">
                        {availableLessons.length === 0 ? 
                            'אין שיעורים זמינים כרגע' : 
                            'אין שיעורים התואמים לפילטרים שנבחרו'
                        }
                    </div>
                ) : (
                    filteredLessons.map(lesson => (
                        <div key={lesson.lesson_id} className="available-lesson-card">
                            <div className="lesson-header">
                                <div className="lesson-icon">
                                    {getLessonIcon(lesson.lesson_type)}
                                </div>
                                <div className="lesson-info">
                                    <h3 className="lesson-title">
                                        שיעור {translateLessonType(lesson.lesson_type)}
                                    </h3>
                                    <div className="lesson-meta">
                                        <span className="lesson-date">📅 {formatDate(lesson.lesson_date)}</span>
                                        <span className="lesson-time">
                                            🕐 {formatTime(lesson.end_time)} - {formatTime(lesson.start_time)}
                                        </span>
                                        <span
                                            className="lesson-level"
                                            style={{ backgroundColor: getLevelColor(lesson.level) }}
                                        >
                                            {translateLevel(lesson.level)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="lesson-details">
                                <div className="lesson-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">מורה:</span>
                                        <span className="info-value">{lesson.teacher_name}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">בריכה:</span>
                                        <span className="info-value">{lesson.pool_name}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">טווח גילאים:</span>
                                        <span className="info-value">{lesson.age_range || 'כל הגילאים'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">מקומות פנויים:</span>
                                        <span className="info-value available-spots">
                                            {lesson.available_spots} מתוך {lesson.max_participants}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="lesson-actions">
                                <button 
                                    className="btn-register"
                                    onClick={() => handleRegisterToLesson(lesson.lesson_id)}
                                >
                                    הצטרף לשיעור
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RegisterLesson;