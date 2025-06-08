import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { userContext } from './App';
import AddItem from './AddItem';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from './useHandleError';
import '../styles/MyLessons.css';

function MyLessons() {

  const { userData } = useContext(userContext);

  const [lessons, setLessons] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useHandleError();

  // בדיקה אם handleError משתנה
  const handleErrorRef = React.useRef(handleError);
  if (handleErrorRef.current !== handleError) {
    handleErrorRef.current = handleError;
  }

  const isTeacher = userData?.type_name === 'teacher';

  // פונקציה לחישוב הפרש זמן בדקות
  const getTimeDifferenceInMinutes = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;

    return endTotalMin - startTotalMin;
  };

  const lessonKeys = useMemo(() => {
    console.log('Calculating lessonKeys - pools:', pools.length);

    return [
      {
        key: 'lesson_date',
        label: 'תאריך השיעור',
        inputType: 'date',
        placeholder: 'בחר תאריך'
      },
      {
        key: 'start_time',
        label: 'שעת התחלה',
        inputType: 'time',
        placeholder: 'HH:MM'
      },
      {
        key: 'end_time',
        label: 'שעת סיום',
        inputType: 'time',
        placeholder: 'HH:MM'
      },
      {
        key: 'lesson_type',
        label: 'סוג השיעור',
        type: 'select',
        placeholder: 'בחר סוג שיעור',
        options: [
          { value: 'private', label: 'פרטי' },
          { value: 'group', label: 'קבוצתי' }
        ]
      },
      {
        key: 'level',
        label: 'רמה',
        type: 'select',
        placeholder: 'בחר רמה',
        options: [
          { value: 'beginner', label: 'מתחיל' },
          { value: 'intermediate', label: 'בינוני' },
          { value: 'advanced', label: 'מתקדם' }
        ]
      },
      {
        key: 'pool_id',
        label: 'בריכה',
        type: 'select',
        placeholder: 'בחר בריכה',
        options: pools && pools.length > 0
          ? pools.map(pool => ({
            value: pool.pool_id,
            label: `${pool.name} - ${pool.city}`
          }))
          : [{ value: '', label: 'טוען בריכות...' }]
      },
      {
        key: 'max_participants',
        label: 'מקסימום משתתפים',
        inputType: 'number',
        placeholder: 'מספר משתתפים'
      },
      {
        key: 'age_range',
        label: 'טווח גילאים',
        placeholder: 'לדוגמה: 6-12'
      }
    ];
  }, [pools]); // רק כאשר pools משתנה

  const lessonValidationRules = useMemo(() => ({
    lesson_date: {
      required: "תאריך השיעור הוא שדה חובה",
      validate: (value) => {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today || "התאריך חייב להיות היום או בעתיד";
      }
    },

    start_time: {
      required: "שעת התחלה היא שדה חובה",
      pattern: {
        value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        message: "פורמט שעה לא תקין (HH:MM)"
      }
    },

    end_time: {
      required: "שעת סיום היא שדה חובה",
      pattern: {
        value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        message: "פורמט שעה לא תקין (HH:MM)"
      },
      validate: (value, { start_time }) => {
        if (!start_time) return true;

        const diffMinutes = getTimeDifferenceInMinutes(start_time, value);

        if (diffMinutes <= 0) {
          return "שעת סיום חייבת להיות אחרי שעת התחלה";
        }
        if (diffMinutes < 40) {
          return "השיעור חייב להיות לפחות 40 דקות";
        }
        if (diffMinutes > 90) {
          return "השיעור לא יכול להיות יותר משעה וחצי";
        }
        return true;
      }
    },

    lesson_type: {
      required: "סוג השיעור הוא שדה חובה"
    },

    level: {
      required: "רמה היא שדה חובה"
    },

    pool_id: {
      required: "בריכה היא שדה חובה"
    },

    max_participants: {
      required: "מספר משתתפים הוא שדה חובה",
      validate: (value, { lesson_type }) => {
        if (lesson_type === 'private') return true;

        const participants = parseInt(value);
        if (isNaN(participants)) {
          return "מספר משתתפים חייב להיות מספר";
        }

        if (lesson_type === 'group') {
          if (participants < 2) {
            return "שיעור קבוצתי חייב להיות לפחות 2 משתתפים";
          }
          if (participants > 10) {
            return "שיעור קבוצתי מקסימום 10 משתתפים";
          }
        }
        return true;
      }
    },

    age_range: {
      required: "טווח גילאים הוא שדה חובה",
      minLength: {
        value: 3,
        message: "טווח גילאים חייב להכיל לפחות 3 תווים"
      }
    },

    onFieldChange: (key, value, watchedValues, setValue) => {
      if (key === 'lesson_type') {
        if (value === 'private') {
          return { max_participants: 1 };
        } else if (value === 'group') {
          return { max_participants: '' };
        }
      }
      return null;
    }
  }), [getTimeDifferenceInMinutes]); // תלות בפונקציה שאינה משתנה

  const defaultLessonValues = useMemo(() => ({
    lesson_date: '',
    start_time: '',
    end_time: '',
    lesson_type: '',
    level: '',
    pool_id: '',
    max_participants: '',
    age_range: ''
  }), []);

  // פונקציות עזר לסטטוס
  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'confirmed';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'מאושר';
      case 'pending': return 'ממתין לאישור';
      case 'cancelled': return 'מבוטל';
      default: return 'ממתין לאישור';
    }
  };

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
          // הסרת handleError מכאן
          setPools([]);
        }
      }
    };

    fetchPools();

    return () => {
      isMounted = false;
    };
  }, []);

  // useEffect נפרד לטעינת שיעורים - הסרת handleError מהתלויות
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
  // פונקציה להוספת שיעור חדש לרשימה
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

        {/* כפתור הוספת שיעור למורים בלבד */}
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
              defaltValues={defaultLessonValues}
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