
import React, { useState, useEffect, useContext } from 'react';
import { userContext } from './App';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from '../hooks/useHandleError';
import Lesson from './Lesson';
import '../styles/RegisterLesson.css';

export const RegisterLessonsContext = React.createContext();

function RegisterLesson() {
    const { userData } = useContext(userContext);
    const [availableLessons, setAvailableLessons] = useState([]);
    const [pools, setPools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [successMessage, setSuccessMessage] = useState('');

    const [filter, setFilter] = useState({
        lessonType: 'all',
        level: 'all',
        poolId: 'all',
        poolName: 'all'
    });
    const { handleError } = useHandleError();


    const availablePoolNames = React.useMemo(() => {
        const poolNames = [...new Set(availableLessons.map(lesson => lesson.pool_name))];
        return poolNames.filter(Boolean).sort();
    }, [availableLessons]);

    const handleRegistrationSuccess = (registrationData) => {
        console.log('Registration successful:', registrationData);

        if (registrationData && registrationData.lesson_id) {
            setAvailableLessons(prev =>
                prev.filter(lesson => lesson.lesson_id !== registrationData.lesson_id)
            );
        }

        setSuccessMessage('🎉 הרישום לשיעור בוצע בהצלחה!');

        setTimeout(() => {
            setSuccessMessage('');
        }, 4000);
    };

    useEffect(() => {
        let isMounted = true;
        const fetchPools = async () => {
            try {
                const poolsResponse = await fetchData('pools', '', handleError);

                if (!isMounted) return;

                if (poolsResponse && poolsResponse.success && poolsResponse.data) {
                    setPools(poolsResponse.data);
                } else if (poolsResponse && Array.isArray(poolsResponse)) {
                    setPools(poolsResponse);
                } else {
                    setPools([]);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching pools:', error);
                    setPools([]);
                }
            }
        };

        fetchPools();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const loadAvailableLessons = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Loading available lessons...');

                const response = await fetchData('lessons', '', handleError);
                console.log('Response from server:', response);

                if (!isMounted) return;

                const lessons = response?.data || response || [];
                setAvailableLessons(lessons);
                console.log('Available lessons loaded:', lessons.length);

            } catch (err) {
                if (isMounted) {
                    console.error('Error loading lessons:', err);
                    setError('שגיאה בטעינת השיעורים');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadAvailableLessons();
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredLessons = availableLessons.filter(lesson => {
        if (filter.lessonType !== 'all' && lesson.lesson_type !== filter.lessonType) return false;
        if (filter.level !== 'all' && lesson.level !== filter.level) return false;
        if (filter.poolId !== 'all' && lesson.pool_id !== parseInt(filter.poolId)) return false;
        if (filter.poolName !== 'all' && lesson.pool_name !== filter.poolName) return false;
        return true;
    });

    if (!userData) {
        return <div className="loading">טוען נתוני משתמש...</div>;
    }

    if (loading) {
        return <div className="register-lesson-container">טוען שיעורים...</div>;
    }

    if (error) {
        return (
            <div className="register-lesson-container">
                <div className="error">{error}</div>
                <button onClick={() => window.location.reload()}>נסה שוב</button>
            </div>
        );
    }

    return (
        <RegisterLessonsContext.Provider value={{
            addRegistration: handleRegistrationSuccess,
            mode: 'register'
        }}>
            <div className="register-lesson-container">
                <div className="page-header">
                    <h1>רישום לשיעור חדש</h1>
                    <p>בחר שיעור מהרשימה להירשם אליו</p>
                </div>

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                <div className="filters-section">
                    <div className="filter-group">
                        <label>סוג שיעור:</label>
                        <select
                            value={filter.lessonType}
                            onChange={(e) => setFilter({ ...filter, lessonType: e.target.value })}
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
                            onChange={(e) => setFilter({ ...filter, level: e.target.value })}
                        >
                            <option value="all">הכל</option>
                            <option value="beginner">מתחיל</option>
                            <option value="intermediate">בינוני</option>
                            <option value="advanced">מתקדם</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>בריכה:</label>
                        <select
                            value={filter.poolName}
                            onChange={(e) => setFilter({ ...filter, poolName: e.target.value })}
                        >
                            <option value="all">כל הבריכות</option>
                            {availablePoolNames.map(poolName => (
                                <option key={poolName} value={poolName}>
                                    {poolName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="lessons-container">
                    {filteredLessons.length === 0 ? (
                        <div className="no-lessons">
                            <h3>אין שיעורים זמינים</h3>
                            <p>
                                {availableLessons.length === 0 ?
                                    'אין שיעורים זמינים כרגע' :
                                    'אין שיעורים התואמים לפילטרים שנבחרו'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="lessons-grid">
                            {filteredLessons.map(lesson => (
                                <Lesson
                                    key={lesson.lesson_id}
                                    lesson={lesson}
                                    pools={pools}
                                    mode="register"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </RegisterLessonsContext.Provider>
    );
}

export default RegisterLesson;
