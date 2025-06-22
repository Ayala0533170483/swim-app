import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import he from 'date-fns/locale/he';

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
  const handleSelectEvent = (event) => {
    alert(`🏊‍♂️ ${event.title}
🕒 ${format(event.start, 'HH:mm', { locale: he })} - ${format(event.end, 'HH:mm', { locale: he })}
📅 ${format(event.start, 'dd/MM/yyyy', { locale: he })}
📍 ${event.location}
${event.description ? `📝 ${event.description}` : ''}
    `);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: '#3174ad',
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px'
      }
    };
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, minHeight: 600 }}
        messages={{
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
        }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        popup={true}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        culture="he"
        rtl={true}
        step={30}
        timeslots={2}
      />
    </div>
  );
}
