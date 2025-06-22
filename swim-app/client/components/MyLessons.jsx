
import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { userContext } from './App';
import AddItem from './AddItem';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from '../hooks/useHandleError';
import '../styles/MyLessons.css';
import useHandleDisplay from '../hooks/useHandleDisplay';
import Lesson from './Lesson';
import CalendarModal from './CalendarView';
import {
  createLessonKeys,
  createLessonValidationRules,
  defaultLessonValues,
  formatDate,
  formatTime,
  translateLessonType,
  translateLevel,
  formatConflictLessonForModal,
  getWarningIcon,
  getWarningTitle
} from '../structures/lessonStructures';
import '../styles/Modal.css';
import '../styles/Update.css';
import CalendarInline from './CalendarModalInline';


export const LessonsContext = React.createContext();

function MyLessons() {
  const { userData } = useContext(userContext);
  const [lessons, setLessons, updateLessons, deleteLessons, addLessons] = useHandleDisplay([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayChanged, setDisplayChanged] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('cards');

  const { handleError } = useHandleError();
  const isTeacher = userData?.type_name === 'teacher';
  const [conflictModal, setConflictModal] = useState({
    isOpen: false,
    conflictLesson: null,
    message: '',
    type: ''
  });

  const lessonKeys = useMemo(() => {
    return createLessonKeys(pools);
  }, [pools]);

  const lessonValidationRules = useMemo(() => {
    return createLessonValidationRules();
  }, []);

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
    const fetchLessons = async () => {
      if (!userData) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);
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
          setLoading(false);
        }
      }
    };

    fetchLessons();
    return () => {
      isMounted = false;
    };
  }, [userData?.user_id]);

  const handleAddLesson = useCallback(async (newLesson) => {
    console.log('🔍 handleAddLesson called with:', newLesson);

    try {
      // טיפול באזהרות
      if (newLesson.warnings && newLesson.warnings.length > 0) {
        console.log('⚠️ Warnings found:', newLesson.warnings);

        // נציג את האזהרה הראשונה (או הכי חמורה)
        const warning = newLesson.warnings[0];

        setConflictModal({
          isOpen: true,
          conflictLesson: warning.conflict,
          message: warning.message,
          type: warning.type
        });
      }

      // הוסף את השיעור לרשימה
      addLessons(newLesson.lesson || newLesson);
    } catch (error) {
      console.error('Error in handleAddLesson:', error);
    }
  }, [addLessons]);

  const handleLessonError = (error) => {
    console.log('🔥 handleLessonError called!');
    console.log('Error response data:', error.response?.data);

    if (error.response?.data?.type === 'SCHEDULE_CONFLICT') {
      console.log('🎯 Schedule conflict detected!');
      const { message, conflicts } = error.response.data;

      if (conflicts && conflicts.length > 0) {
        console.log('📋 Setting conflict modal with existing lesson:', conflicts[0]);
        setConflictModal({
          isOpen: true,
          conflictLesson: conflicts[0],
          message: message,
          type: 'SCHEDULE_CONFLICT'
        });
        return true;
      }
    }

    console.log('❌ Not a schedule conflict, using regular error handling');
    return false;
  };

  const closeConflictModal = () => {
    setConflictModal({
      isOpen: false,
      conflictLesson: null,
      message: '',
      type: ''
    });
  };

  const openCalendar = () => {
    setIsCalendarOpen(true);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  if (!userData) {
    return <div className="loading">טוען נתוני משתמש...</div>;
  }

  const ConflictModal = () => {
    if (!conflictModal.isOpen || !conflictModal.conflictLesson) return null;

    const conflictLessonFormatted = formatConflictLessonForModal(conflictModal.conflictLesson);

    return (
      <div className="modal-overlay" onClick={closeConflictModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>
              {getWarningIcon(conflictModal.type)} {getWarningTitle(conflictModal.type)}
            </h2>
            <button className="modal-close" onClick={closeConflictModal}>×</button>
          </div>

          <div className="modal-body">
            <p className="conflict-message">{conflictModal.message}</p>
            <div className="conflict-lesson">
              <h3>פרטי השיעור הקיים:</h3>
              <Lesson
                lesson={conflictLessonFormatted}
                pools={pools}
                mode="conflict"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-modal-close" onClick={closeConflictModal}>
              הבנתי
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <LessonsContext.Provider value={{
      updateLessons,
      deleteLessons,
      displayChanged,
      setDisplayChanged
    }}>
      <div className="my-lessons-page">
        <div className="container">
          <div className="page-header">
            <div className="page-header-content">
              <div className="page-title-section">
                <h1>השיעורים שלי</h1>
                <p>ברוך הבא {userData.name}, כאן תוכל לראות את כל השיעורים שלך</p>
              </div>

              {lessons.length > 0 && (
                <div className="page-header-actions">
                  {/* <button 
                    className="calendar-main-btn" 
                    onClick={openCalendar}
                    title="הצג את כל השיעורים בלוח שנה"
                  >
                    📅 לוח שנה
                  </button> */}
                  <button className="calendar-main-btn" onClick={openCalendar}>📅 לוח שנה (Modal)</button>

                  {/* ה־Checkbox החדש */}
                  <label style={{ marginLeft: 16, display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={viewMode === 'calendar'}
                      onChange={() => setViewMode(prev => prev === 'cards' ? 'calendar' : 'cards')}
                    />
                    <span style={{ marginLeft: 8 }}>לוח שנה במקום כרטיסים</span>
                  </label>
                </div>
              )}
            </div>
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
                onError={handleLessonError}
              />
            </div>
          )}


          {loading ? (
            <div className="loading">טוען...</div>
          ) : (
            <div className="lessons-container">
              {viewMode === 'cards' ? (
                <div className="lessons-grid">
                  {lessons.map(lesson => (
                    <Lesson key={lesson.lesson_id} lesson={lesson} pools={pools} />
                  ))}
                </div>
              ) : (
                <CalendarInline lessons={lessons} userName={userData.name} />
              )}
            </div>
          )}


        </div>
      </div>

      <ConflictModal />
    </LessonsContext.Provider>
  );
}

export default MyLessons;
