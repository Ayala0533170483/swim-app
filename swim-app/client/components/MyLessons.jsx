import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { userContext } from './App';
import AddItem from './AddItem';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from './useHandleError';
import {
  getStatusClass,
  getStatusText,
  createLessonKeys,
  createLessonValidationRules,
  defaultLessonValues
} from '../structures/lessonStructures';
import '../styles/MyLessons.css';

function MyLessons() {
  const { userData } = useContext(userContext);
  const [lessons, setLessons] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useHandleError();
  const isTeacher = userData?.type_name === 'teacher';

  const handleErrorRef = React.useRef(handleError);
  if (handleErrorRef.current !== handleError) {
    handleErrorRef.current = handleError;
  }

  const lessonKeys = useMemo(() => {
    console.log('Calculating lessonKeys - pools:', pools.length);
    return createLessonKeys(pools);
  }, [pools]);

  const lessonValidationRules = useMemo(() => {
    return createLessonValidationRules();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchPools = async () => {
      try {
        console.log('Fetching pools...');
        const poolsResponse = await fetchData('pools', '', '', '');
        console.log('Raw pools response:', poolsResponse);
        if (!isMounted) return;

        if (poolsResponse) {
          let poolsData;
          if (poolsResponse.success && poolsResponse.data) {
            poolsData = poolsResponse.data;
          } else if (Array.isArray(poolsResponse)) {
            poolsData = poolsResponse;
          } else if (poolsResponse.data && Array.isArray(poolsResponse.data)) {
            poolsData = poolsResponse.data;
          } else {
            console.error('Unexpected pools response structure:', poolsResponse);
            poolsData = [];
          }

          console.log('Processed pools data:', poolsData);
          if (Array.isArray(poolsData)) {
            setPools(poolsData);
            console.log('Pools set successfully:', poolsData.length, 'pools');
          } else {
            console.error('Pools data is not an array:', poolsData);
            setPools([]);
          }
        } else {
          console.error('No pools response received');
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
    const fetchLessons = async () => {
      if (!userData || !userData.id) {
        console.log('No userData or userData.id available for lessons');
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);
        const lessonsResponse = await fetch(`http://localhost:3000/lessons/user/${userData.id}`, {
          credentials: 'include'
        });

        if (!isMounted) return;

        if (lessonsResponse.ok) {
          const lessonsData = await lessonsResponse.json();
          setLessons(lessonsData);
          console.log('Lessons loaded:', lessonsData);
        } else {
          console.error('Failed to fetch lessons:', lessonsResponse.status);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching lessons:', error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLessons();
    return () => {
      isMounted = false;
    };
  }, [userData?.id]);

  const handleAddLesson = useCallback((newLesson) => {
    setLessons(prevLessons => [...prevLessons, newLesson]);
  }, []);

  if (!userData) {
    return <div className="loading">טוען נתוני משתמש...</div>;
  }

  return (
    <div className="my-lessons-page">
      <div className="container">
        <div className="page-header">
          <h1>השיעורים שלי</h1>
          <p>ברוך הבא {userData.name}, כאן תוכל לראות את כל השיעורים שלך</p>
        </div>

        {isTeacher && (
          <div className="teacher-actions">
            {pools.length === 0 && !loading && (
              <div style={{ color: 'orange', marginBottom: '10px' }}>
                אזהרה: לא נטענו בריכות. בדוק את החיבור לשרת.
              </div>
            )}
            <AddItem
              userType={userData.type_name}
              userId={userData.user_id}
              type="lessons"
              addDisplay={handleAddLesson}
              defaltValues={defaultLessonValues(userData.user_id)} 
              nameButton="הוספת שיעור חדש"
              validationRules={lessonValidationRules}
              keys={lessonKeys}
            />
          </div>
        )}

        {loading ? (
          <div className="loading">טוען...</div>
        ) : (
          <div className="lessons-container">
            {lessons.length === 0 ? (
              <div className="no-lessons">
                <h3>{isTeacher ? 'אין לך שיעורים שנוצרו' : 'אין לך שיעורים רשומים'}</h3>
                <p>
                  {isTeacher
                    ? 'לחץ על "הוספת שיעור חדש" כדי ליצור שיעור חדש'
                    : 'לחץ על "רישום לשיעור חדש" כדי להירשם לשיעור'
                  }
                </p>
              </div>
            ) : (
              <div className="lessons-grid">
                {lessons.map(lesson => (
                  <div key={lesson.lesson_id} className="lesson-card">
                    <div className="lesson-header">
                      <h3>שיעור שחייה - {lesson.lesson_type === 'private' ? 'פרטי' : 'קבוצתי'}</h3>
                      <span className={`status ${getStatusClass(lesson.is_confirmed ? 'confirmed' : 'pending')}`}>
                        {getStatusText(lesson.is_confirmed ? 'confirmed' : 'pending')}
                      </span>
                    </div>
                    <div className="lesson-details">
                      <div className="detail-item">
                        <span className="label">תאריך:</span>
                        <span className="value">{new Date(lesson.lesson_date).toLocaleDateString('he-IL')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">שעה:</span>
                        <span className="value">{lesson.start_time} - {lesson.end_time}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">בריכה:</span>
                        <span className="value">{lesson.pool_name || `בריכה ${lesson.pool_id}`}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">רמה:</span>
                        <span className="value">{lesson.level}</span>
                      </div>
                      {lesson.lesson_type === 'group' && (
                        <div className="detail-item">
                          <span className="label">מקסימום משתתפים:</span>
                          <span className="value">{lesson.max_participants}</span>
                        </div>
                      )}
                      {lesson.age_range && (
                        <div className="detail-item">
                          <span className="label">טווח גילאים:</span>
                          <span className="value">{lesson.age_range}</span>
                        </div>
                      )}
                    </div>
                    <div className="lesson-actions">
                      <button className="btn btn-primary">פרטים</button>
                      {lesson.is_confirmed && (
                        <button className="btn btn-secondary">
                          {isTeacher ? 'עריכה' : 'ביטול'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLessons;
