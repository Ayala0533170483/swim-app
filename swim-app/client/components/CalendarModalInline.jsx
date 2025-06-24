import React from 'react';
import CalendarView from './CalendarView';
import '../styles/CalendarInline.css';
import { convertLessonToCalendarEvent } from '../structures/lessonStructures';

export default function CalendarInline({ lessons, userName }) {
    
    const events = lessons.map(lesson => {
        return convertLessonToCalendarEvent(lesson);
    });


    return (
        <div className="calendar-inline-container">
            <div className="calendar-header">
                <h2>השיעורים שלי – לוח שנה</h2>
                <p>סה"כ {lessons.length} שיעורים</p>
                {lessons.length > 0 && (
                    <div className="calendar-legend">
                        <div className="legend-item">
                            <span className="legend-color beginner"></span>
                            <span>מתחיל</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color intermediate"></span>
                            <span>בינוני</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color advanced"></span>
                            <span>מתקדם</span>
                        </div>
                    </div>
                )}
            </div>
            <CalendarView events={events} />
        </div>
    );
}
