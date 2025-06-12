import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { userContext } from './App';
import AddItem from './AddItem';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from './useHandleError';
import '../styles/MyLessons.css';
import useHandleDisplay from './useHandleDisplay';
import Lesson from './Lesson';
import {
  createLessonKeys,
  createLessonValidationRules,
  defaultLessonValues
} from '../structures/lessonStructures';

export const LessonsContext = React.createContext();
function MyLessons() {
  const { userData } = useContext(userContext);
  const [lessons, setLessons, updateLessons, deleteLessons, addLessons] = useHandleDisplay([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayChanged, setDisplayChanged] = useState(false);
  const { handleError } = useHandleError();
  const isTeacher = userData?.type_name === 'teacher';

  console.log('MyLessons render - userData:', userData);

  const lessonKeys = useMemo(() => {
    return createLessonKeys(pools);
  }, [pools]);

  const lessonValidationRules = useMemo(() => {
    return createLessonValidationRules();
  }, []);

  const getPoolName = useCallback((poolId) => {
    const pool = pools.find(p => p.pool_id === poolId);
    return pool ? pool.pool_name : `בריכה ${poolId}`;
  }, [pools]);

  useEffect(() => {
    let isMounted = true;
    const fetchPools = async () => {
      try {
        console.log('Fetching pools...');
        const poolsResponse = await fetchData('pools', '', handleError);
        console.log('Pools response:', poolsResponse);

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
    const fetchLessons = async () => {
      console.log('fetchLessons called - userData:', userData);

      if (!userData) {
        console.log('No userData yet');
        if (isMounted) setLoading(false);
        return;
      }

      if (!userData.user_id) {
        console.log('No userData.user_id:', userData);
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);
        console.log('Starting to fetch lessons for teacher ID:', userData.user_id);
        const lessonsResponse = await fetchData("lessons", userData.user_id, handleError);

        if (!isMounted) return;
        setLessons(lessonsResponse.data);
      } catch (error) {
        if (isMounted) {
          console.error('❌ Error fetching lessons:', error);
          setLessons([]);
        }
      } finally {
        if (isMounted) {
          console.log('Setting loading to false');
          setLoading(false);
        }
      }
    };

    fetchLessons();
    return () => {
      isMounted = false;
    };
  }, [userData?.user_id]);

  const handleAddLesson = useCallback((newLesson) => {
    addLessons(newLesson);
  }, [addLessons]);

  console.log('Current state - loading:', loading, 'lessons:', lessons.length, 'userData.user_id:', userData?.user_id);

  if (!userData) {
    return <div className="loading">טוען נתוני משתמש...</div>;
  }

  return (
    <LessonsContext.Provider value={{
      updateLessons,
      deleteLessons,
      displayChanged,
      setDisplayChanged,
      getPoolName // הוספת הפונקציה לקונטקסט
    }}>
      <div className="my-lessons-page">
        <div className="container">
          <div className="page-header">
            <h1>השיעורים שלי</h1>
            <p>ברוך הבא {userData.name}, כאן תוכל לראות את כל השיעורים שלך</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
            </p>
          </div>

          {isTeacher && (
            <div className="teacher-actions">
              <AddItem
                userType={userData.type_name}
                userId={userData.user_id}
                type="lessons"
                addDisplay={handleAddLesson}
                defaltValues={defaultLessonValues(userData.user_id)}
                nameButton="הוספת שיעור חדש"
                validationRules={lessonValidationRules}
                keys={lessonKeys}
                setDisplayChanged={setDisplayChanged}
              />
            </div>
          )}

          {loading ? (
            <div className="loading">טוען...</div>
          ) : (
            <div className="lessons-container">
              {lessons.length === 0 ? (
                <div className="no-lessons">
                  <h3>אין לך שיעורים</h3>
                  <p>
                    {isTeacher
                      ? 'לחץ על "הוספת שיעור חדש" כדי ליצור שיעור חדש'
                      : 'אין לך שיעורים רשומים'
                    }
                  </p>
                </div>
              ) : (
                <>
                  <div className="lessons-grid">
                    {lessons.map(lesson => (
                      <Lesson
                        key={lesson.lesson_id}
                        lesson={lesson}
                        pools={pools} // העברת מערך הבריכות
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </LessonsContext.Provider>
  );
}

export default MyLessons;
