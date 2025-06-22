
// import React, { useState } from 'react';
// import '../styles/CalendarModal.css';

// function CalendarModal({ isOpen, onClose, selectedDate, lessonTitle }) {
//   if (!isOpen) return null;

//   const lessonDate = new Date(selectedDate);
//   const [currentDate, setCurrentDate] = useState(new Date(lessonDate.getFullYear(), lessonDate.getMonth(), 1));

//   const formatDateHebrew = (date) => {
//     return new Intl.DateTimeFormat('he-IL', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     }).format(date);
//   };

//   const getMonthName = (date) => {
//     return new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(date);
//   };

//   const getDaysInMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//   };

//   const navigateMonth = (direction) => {
//     setCurrentDate(prev => {
//       const newDate = new Date(prev);
//       newDate.setMonth(prev.getMonth() + direction);
//       return newDate;
//     });
//   };

//   const goToToday = () => {
//     setCurrentDate(new Date());
//   };

//   const goToLessonMonth = () => {
//     setCurrentDate(new Date(lessonDate.getFullYear(), lessonDate.getMonth(), 1));
//   };

//   const renderCalendar = () => {
//     const daysInMonth = getDaysInMonth(currentDate);
//     const firstDay = getFirstDayOfMonth(currentDate);
//     const today = new Date();
    
//     const days = [];
//     const weekdays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

    
//     const weekdayHeaders = weekdays.map(day => (
//       <div key={day} className="calendar-weekday-header">
//         {day}
//       </div>
//     ));


//     for (let i = 0; i < firstDay; i++) {
//       days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
//     }

    
//     for (let day = 1; day <= daysInMonth; day++) {
//       const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//       const isToday = dayDate.toDateString() === today.toDateString();
//       const isLessonDay = dayDate.toDateString() === lessonDate.toDateString();
//       const isWeekend = dayDate.getDay() === 5 || dayDate.getDay() === 6; // יום ו' ושבת

//       let className = 'calendar-day';
//       if (isToday) className += ' today';
//       if (isLessonDay) className += ' lesson-day';
//       if (isWeekend) className += ' weekend';

//       days.push(
//         <div key={day} className={className}>
//           <span className="day-number">{day}</span>
//           {isLessonDay && <span className="lesson-indicator">🏊‍♂️</span>}
//         </div>
//       );
//     }

//     return (
//       <div className="custom-calendar">
//         <div className="calendar-header">
//           <button onClick={() => navigateMonth(-1)} className="nav-button">
//             ◀
//           </button>
//           <div className="month-year">
//             {getMonthName(currentDate)}
//           </div>
//           <button onClick={() => navigateMonth(1)} className="nav-button">
//             ▶
//           </button>
//         </div>
        
//         <div className="calendar-controls">
//           <button onClick={goToToday} className="control-button">
//             היום
//           </button>
//           <button onClick={goToLessonMonth} className="control-button lesson-button">
//             חודש השיעור
//           </button>
//         </div>

//         <div className="calendar-grid">
//           {weekdayHeaders}
//           {days}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="calendar-modal-overlay" onClick={onClose}>
//       <div className="calendar-modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="calendar-modal-header">
//           <h2>📅 לוח שנה - {lessonTitle}</h2>
//           <button className="calendar-modal-close" onClick={onClose}>×</button>
//         </div>
        
//         <div className="calendar-modal-body">
//           <div className="selected-date-info">
//             <h3>תאריך השיעור:</h3>
//             <p className="selected-date">{formatDateHebrew(lessonDate)}</p>
//           </div>
          
//           <div className="calendar-container">
//             {renderCalendar()}
//           </div>
          
//           <div className="lesson-info-box">
//             <h4>פרטי השיעור:</h4>
//             <p>{lessonTitle}</p>
//             <div className="legend">
//               <div className="legend-item">
//                 <span className="legend-icon">🏊‍♂️</span>
//                 <span>יום השיעור</span>
//               </div>
//               <div className="legend-item">
//                 <div className="legend-color-box lesson-color"></div>
//                 <span>תאריך השיעור</span>
//               </div>
//               <div className="legend-item">
//                 <div className="legend-color-box today-color"></div>
//                 <span>היום</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="calendar-modal-footer">
//           <button className="btn-calendar-close" onClick={onClose}>
//             סגור
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CalendarModal;








import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { he } from 'date-fns/locale';
import '../styles/CalendarModal.css';

function CalendarModal({ isOpen, onClose, selectedDate, lessonTitle }) {
  if (!isOpen) return null;

  const lessonDate = new Date(selectedDate);
  const [currentDate, setCurrentDate] = useState(
    new Date(lessonDate.getFullYear(), lessonDate.getMonth(), 1)
  );

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
  };

  const goToLessonMonth = () => {
    setCurrentDate(new Date(lessonDate.getFullYear(), lessonDate.getMonth(), 1));
  };

  // המערך של האותיות לראשי התיבות של ימות השבוע בעברית, לפי index של getDay():
  const hebrewWeekdayLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

  const renderCalendar = () => {
    // משתמשים ב־DayPicker לבניית גריד הימים
    return (
      <div className="custom-calendar">
        {/* כותרת ניווט חודש */}
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

        {/* כפתורים של היום וחודש השיעור */}
        <div className="calendar-controls">
          <button onClick={goToToday} className="control-button">
            היום
          </button>
          <button onClick={goToLessonMonth} className="control-button lesson-button">
            חודש השיעור
          </button>
        </div>

        {/* ה־DayPicker עצמו */}
        <DayPicker
          locale={he}
          month={currentDate}
          onMonthChange={setCurrentDate}
          // לא להראות ימים מחוץ לחודש
          showOutsideDays={false}
          // הגדרת היום של השיעור כ‐modifier
          modifiers={{
            lessonDay: lessonDate,
            today: new Date(),
            weekend: { daysOfWeek: [5, 6] } // יום ו' ושבת
          }}
          // מיפוי שמות מחלקות ל־modifiers
          modifiersClassNames={{
            lessonDay: 'lesson-day',
            today: 'today',
            weekend: 'weekend',
            outside: 'empty'
          }}
          // מחלקת בסיס לכל תא יום
          classNames={{
            day: 'calendar-day'
          }}
          // רינדור מותאם של כותרות ימות השבוע: נגדיר קומפוננטה Weekday
          components={{
            Weekday: ({ weekday, ...props }) => {
              // weekday.date הוא אובייקט Date; נקבל getDay() כדי למפות לאות העברית
              const letter = hebrewWeekdayLetters[weekday.date.getDay()];
              return (
                <div className="calendar-weekday-header" {...props}>
                  {letter}
                </div>
              );
            }
          }}
          // העמודה של כותרות הימים (head_row) משתמשת כבר במחלקה calendar-weekday-header, 
          // ו־DayPicker יכניס את האלמנט מתוך ה־components. 
        />
      </div>
    );
  };

  return (
    <div className="calendar-modal-overlay" onClick={onClose}>
      <div className="calendar-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-modal-header">
          <h2>📅 לוח שנה - {lessonTitle}</h2>
          <button className="calendar-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="calendar-modal-body">
          <div className="selected-date-info">
            <h3>תאריך השיעור:</h3>
            <p className="selected-date">{formatDateHebrew(lessonDate)}</p>
          </div>

          <div className="calendar-container">
            {renderCalendar()}
          </div>

          <div className="lesson-info-box">
            <h4>פרטי השיעור:</h4>
            <p>{lessonTitle}</p>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-icon">🏊‍♂️</span>
                <span>יום השיעור</span>
              </div>
              <div className="legend-item">
                <div className="legend-color-box lesson-color"></div>
                <span>תאריך השיעור</span>
              </div>
              <div className="legend-item">
                <div className="legend-color-box today-color"></div>
                <span>היום</span>
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
