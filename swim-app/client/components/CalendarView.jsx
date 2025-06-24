import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import he from 'date-fns/locale/he';
import Lesson from './Lesson';

const locales = {
  'he': he,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export default function CalendarView({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectEvent = (event) => {
    const lessonData = {
      lesson_id: event.id,
      lesson_date: event.start,
      start_time: format(event.start, 'HH:mm'),
      end_time: format(event.end, 'HH:mm'),
      lesson_type: event.lesson_type || 'group',
      level: event.level || 'beginner',
      pool_name: event.location,
      pool_id: event.pool_id,
      min_age: event.min_age,
      max_age: event.max_age,
      teacher_name: event.teacher_name,
      registrations: event.registrations || []
    };
    
    setSelectedEvent(lessonData);
  };

  const handleNavigate = (action) => {
    if (action === 'PREV') {
      setCurrentDate(prevDate => subMonths(prevDate, 1));
    } else if (action === 'NEXT') {
      setCurrentDate(prevDate => addMonths(prevDate, 1));
    } else if (action === 'TODAY') {
      setCurrentDate(new Date());
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#3174ad';
    
    if (event.level) {
      switch (event.level.toLowerCase()) {
        case 'beginner':
          backgroundColor = '#28a745';
          break;
        case 'intermediate':
          backgroundColor = '#ffc107';
          break;
        case 'advanced':
          backgroundColor = '#dc3545';
          break;
        default:
          backgroundColor = '#3174ad';
      }
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px',
        fontWeight: 'bold'
      }
    };
  };

  const hebrewMessages = {
    today: 'היום',
    previous: '◀',
    next: '▶',
    month: 'חודש',
    week: 'שבוע',
    day: 'יום',
    agenda: 'רשימה',
    date: 'תאריך',
    time: 'שעה',
    event: 'שיעור',
    noEventsInRange: 'אין שיעורים בטווח התאריכים הזה',
    showMore: total => `+${total} נוספים`,
    allDay: 'כל היום',
    work_week: 'שבוע עבודה',
  };

  const hebrewFormats = {
    monthHeaderFormat: (date, culture, localizer) => 
      localizer.format(date, 'MMMM yyyy', culture),
    dayHeaderFormat: (date, culture, localizer) => 
      localizer.format(date, 'EEEE', culture),
  };

  const getMonthYearLabel = () => {
    return format(currentDate, 'MMMM yyyy', { locale: he });
  };

  return (
    <div className="calendar-wrapper">
      <div className="custom-calendar-toolbar">
        <button 
          className="nav-btn next-btn"
          onClick={() => handleNavigate('NEXT')}
          title="חודש הבא"
        >
          ▶
        </button>
        <h3 className="calendar-title">{getMonthYearLabel()}</h3>
        <button 
          className="nav-btn prev-btn"
          onClick={() => handleNavigate('PREV')}
          title="חודש קודם"
        >
          ◀
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 550, minHeight: 550 }}
        messages={hebrewMessages}
        formats={hebrewFormats}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        popup={true}
        views={['month']}
        view="month"
        onView={() => {}}
        date={currentDate}
        onNavigate={() => {}}
        culture="he"
        rtl={false}
        step={30}
        timeslots={2}
        showMultiDayTimes={true}
        toolbar={false}
      />

      {selectedEvent && (   
        <Lesson 
          lesson={selectedEvent}
          pools={[]}
          mode="view"
          showAsModal={true}
        />
      )}
    </div>
  );
}
