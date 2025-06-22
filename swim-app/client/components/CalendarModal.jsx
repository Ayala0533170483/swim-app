
import React, { useState, useMemo } from 'react';
import '../styles/CalendarModal.css';
import {
  formatDate,
  formatTime,
  translateLessonType,
  translateLevel,
  getLessonIcon
} from '../structures/lessonStructures';

function CalendarModal({ isOpen, onClose, lessons, userName }) {
  if (!isOpen) return null;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const formatDateHebrew = (date) => {
    return new Intl.DateTimeFormat('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getMonthName = (date) => {
    return new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(date);
  };

  //
  // יצירת מפה של תאריכים עם שיעורים
  const lessonsByDate = useMemo(() => {
    const dateMap = {};
    lessons.forEach(lesson => {
      const dateKey = new Date(lesson.lesson_date).toDateString();
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = [];
      }
      dateMap[dateKey].push(lesson);
    });
    return dateMap;
  }, [lessons]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(null);
  };

  const goToNextLesson = () => {
    const today = new Date();
    const futureLessons = lessons.filter(lesson => new Date(lesson.lesson_date) >= today);
    
    if (futureLessons.length > 0) {
      const nextLesson = futureLessons.sort((a, b) => new Date(a.lesson_date) - new Date(b.lesson_date))[0];
      const nextLessonDate = new Date(nextLesson.lesson_date);
      setCurrentDate(new Date(nextLessonDate.getFullYear(), nextLessonDate.getMonth(), 1));
      setSelectedDate(nextLessonDate);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (dayDate, hasLessons) => {
    if (hasLessons) {
      setSelectedDate(dayDate);
    } else {
      setSelectedDate(null);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    
    const days = [];
    const weekdays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

    // כותרות ימות השבוע
    const weekdayHeaders = weekdays.map(day => (
      <div key={day} className="calendar-weekday-header">
        {day}
      </div>
    ));

    // ימים ריקים בתחילת החודש
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // ימי החודש
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayKey = dayDate.toDateString();
      const isToday = dayDate.toDateString() === today.toDateString();
      const hasLessons = lessonsByDate[dayKey] && lessonsByDate[dayKey].length > 0;
      const isSelected = selectedDate && dayDate.toDateString() === selectedDate.toDateString();
      const isWeekend = dayDate.getDay() === 5 || dayDate.getDay() === 6; // יום ו' ושבת
      const lessonCount = hasLessons ? lessonsByDate[dayKey].length : 0;

      let className = 'calendar-day';
      if (isToday) className += ' today';
      if (hasLessons) className += ' lesson-day';
      if (isSelected) className += ' selected-day';
      if (isWeekend) className += ' weekend';
      if (lessonCount > 1) className += ' multiple-lessons';

      days.push(
        <div 
          key={day} 
          className={className}
          onClick={() => handleDateClick(dayDate, hasLessons)}
          data-lesson-count={lessonCount > 1 ? lessonCount : ''}
        >
          <span className="day-number">{day}</span>
        </div>
      );
    }

    return (
      <div className="custom-calendar">
        <div className="calendar-header">
          <button onClick={() => navigateMonth(-1)} className="nav-button">
            ◀
          </button>
          <div className="month-year">
            {getMonthName(currentDate)}
          </div>
          <button onClick={() => navigateMonth(1)} className="nav-button">
            ▶
          </button>
        </div>
        
        <div className="calendar-controls">
          <button onClick={goToToday} className="control-button">
            היום
          </button>
          <button onClick={goToNextLesson} className="control-button lesson-button">
            השיעור הבא
          </button>
        </div>

        <div className="calendar-grid">
          {weekdayHeaders}
          {days}
        </div>
      </div>
    );
  };

  const renderLessonsForSelectedDate = () => {
    if (!selectedDate) {
      return (
        <div className="no-selection-message">
          <div className="message-content">
            <div className="message-icon">📅</div>
            <div className="message-text">בחר תאריך עם שיעורים</div>
            <div className="message-subtext">לחץ על תאריך מסומן בירוק כדי לראות את פרטי השיעורים</div>
          </div>
        </div>
      );
    }

    const dayKey = selectedDate.toDateString();
    const dayLessons = lessonsByDate[dayKey];

    if (!dayLessons || dayLessons.length === 0) {
      return (
        <div className="no-selection-message">
          <div className="message-content">
            <div className="message-icon">❌</div>
            <div className="message-text">אין שיעורים בתאריך זה</div>
            <div className="message-subtext">בחר תאריך אחר עם שיעורים</div>
          </div>
        </div>
      );
    }

    return (
      <div className="lessons-section show">
        <div className="lessons-list-container">
          <h4>שיעורים ב-{formatDateHebrew(selectedDate)}:</h4>
          <div className="lessons-list">
            {dayLessons.map(lesson => (
              <div key={lesson.lesson_id} className="lesson-item">
                <div className="lesson-item-header">
                  <span className="lesson-item-icon">{getLessonIcon(lesson.lesson_type)}</span>
                  <span className="lesson-item-time">
                    {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                  </span>
                </div>
                <div className="lesson-item-details">
                  <span className="lesson-item-type">
                    {translateLessonType(lesson.lesson_type)}
                  </span>
                  <span className="lesson-item-level" style={{ backgroundColor: getLevelColor(lesson.level) }}>
                    {translateLevel(lesson.level)}
                  </span>
                  <span className="lesson-item-pool">
                    {lesson.pool_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getLevelColor = (level) => {
    const colors = {
      'beginner': '#4CAF50',
      'intermediate': '#FF9800',
      'advanced': '#F44336'
    };
    return colors[level] || '#9E9E9E';
  };

  const lessonDates = Object.keys(lessonsByDate);

  return (
    <div className="calendar-modal-overlay" onClick={onClose}>
      <div className="calendar-modal-content calendar-modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-modal-header">
          <h2>📅 לוח שנה - השיעורים של {userName}</h2>
          <button className="calendar-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="calendar-modal-body">
          {/* סטטיסטיקות */}
          <div className="calendar-stats">
            <div className="stat-item">
              <div className="stat-number">{lessons.length}</div>
              <div className="stat-label">סה"כ שיעורים</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{lessonDates.length}</div>
              <div className="stat-label">ימים עם שיעורים</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {lessons.filter(lesson => new Date(lesson.lesson_date) >= new Date()).length}
              </div>
              <div className="stat-label">שיעורים עתידיים</div>
            </div>
          </div>

          <div className="calendar-content">
            <div className="calendar-container">
              {renderCalendar()}
            </div>

            {/* פרטי השיעורים ליום שנבחר או הודעה */}
            {renderLessonsForSelectedDate()}
          </div>

          <div className="lesson-info-box">
            <h4>הוראות שימוש:</h4>
            <div className="instructions">
              <p>• לחץ על תאריך מסומן בירוק כדי לראות את פרטי השיעורים באותו יום</p>
              <p>• השתמש בכפתורים "היום" ו"השיעור הבא" לניווט מהיר</p>
              <p>• נקודה לבנה מסמנת יום עם שיעור אחד, מספר מסמן מספר שיעורים</p>
            </div>
            
            <div className="legend">
              <div className="legend-item">
                <div className="legend-color-box lesson-color"></div>
                <span>תאריך עם שיעור</span>
              </div>
              <div className="legend-item">
                <div className="legend-color-box today-color"></div>
                <span>היום</span>
              </div>
              <div className="legend-item">
                <div className="legend-color-box selected-color"></div>
                <span>תאריך נבחר</span>
              </div>
            </div>
          </div>
        </div>

        <div className="calendar-modal-footer">
          <button className="btn-calendar-close" onClick={onClose}>
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;



