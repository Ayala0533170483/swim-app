const ical = require('ical-generator').default;

function createLessonCalendarEvent(lessonData) {
    const lessonDate = new Date(lessonData.lesson_date);
    const [startHour, startMinute] = lessonData.start_time.split(':');
    const [endHour, endMinute] = lessonData.end_time.split(':');
    
    const startDateTime = new Date(lessonDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
    
    const endDateTime = new Date(lessonDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
    
    const calendar = ical({
        name: 'שיעור שחייה',
        timezone: 'Asia/Jerusalem'
    });
    
    const lessonType = lessonData.lesson_type === 'private' ? 'פרטי' : 'קבוצתי';
    
    calendar.createEvent({
        start: startDateTime,
        end: endDateTime,
        summary: `שיעור שחייה ${lessonType}`,
        description: `מדריך: ${lessonData.teacher_name}\nבריכה: ${lessonData.pool_name}`,
        location: lessonData.pool_name,
        alarms: [{
            type: 'display',
            trigger: 60 * 30 // 30 דקות לפני
        }]
    });
    
    return calendar.toString();
}

module.exports = {
    createLessonCalendarEvent
};
