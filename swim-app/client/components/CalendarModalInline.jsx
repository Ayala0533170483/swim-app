import React from 'react';
import CalendarView from './CalendarView';
import '../styles/CalendarInline.css';
export default function CalendarInline({ lessons, userName }) {
    console.log('🔍 Raw lessons data:', lessons);
    
    const events = lessons.map(lesson => {
        console.log('🔍 Processing lesson:', lesson);
        
        let startDate, endDate;
        
        try {
            // אם יש לך שדה date נפרד
            if (lesson.date && lesson.start_time) {
                console.log('📅 Using date + time format');
                console.log('Date:', lesson.date, 'Start time:', lesson.start_time, 'End time:', lesson.end_time);
                
                startDate = new Date(lesson.date + 'T' + lesson.start_time);
                endDate = new Date(lesson.date + 'T' + lesson.end_time);
            }
            // אם יש לך שדות start ו-end מוכנים
            else if (lesson.start && lesson.end) {
                console.log('📅 Using start/end format');
                console.log('Start:', lesson.start, 'End:', lesson.end);
                
                startDate = new Date(lesson.start);
                endDate = new Date(lesson.end);
            }
            // אם יש לך שדה lesson_date
            else if (lesson.lesson_date) {
                console.log('📅 Using lesson_date format');
                console.log('Lesson date:', lesson.lesson_date);
                
                const dateStr = lesson.lesson_date.split('T')[0]; // לקחת רק את החלק של התאריך
                startDate = new Date(dateStr + 'T' + (lesson.start_time || '10:00'));
                endDate = new Date(dateStr + 'T' + (lesson.end_time || '11:00'));
            }
            // ברירת מחדל
            else {
                console.log('📅 Using default dates');
                const now = new Date();
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0);
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0);
            }
            
            console.log('✅ Final dates - Start:', startDate, 'End:', endDate);
            
        } catch (error) {
            console.error('❌ Error parsing lesson date:', lesson, error);
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0);
        }
               
        const event = {
            id: lesson.lesson_id,
            title: lesson.title || `שיעור ${lesson.lesson_type || ''}`,
            start: startDate,
            end: endDate,
            location: lesson.pool_name || 'לא צויין',
            description: `רמה: ${lesson.level || 'לא צויין'}`
        };
        
        console.log('🎯 Final event:', event);
        return event;
    });

    console.log('📋 All events:', events);

    return (
        <div className="calendar-inline-container">
            <div className="calendar-header">
                <h2>השיעורים שלי – לוח שנה</h2>
                <p>סה"כ {lessons.length} שיעורים</p>
            </div>
            <CalendarView events={events} />
        </div>
    );
}

