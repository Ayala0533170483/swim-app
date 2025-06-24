const lessonsService = require('../services/lessonsService');
const { sendLessonConfirmationEmail } = require('./emailsController');
const calendarUtils = require('../utils/calendarUtils');
const { checkScheduleConflict } = require('../utils/timeUtils');

async function registerToLesson(registrationData) {
    try {
        console.log('Registering student to lesson:', registrationData);

        // **גישה אחת ל-DB**: קבלת השיעור החדש + השיעורים הקיימים
        const scheduleData = await lessonsService.getLessonAndStudentSchedule(
            registrationData.lesson_id,
            registrationData.student_id
        );

        if (!scheduleData.newLesson) {
            throw new Error('השיעור לא נמצא או שהוא לא פעיל');
        }

        // **לוגיקה**: בדיקת קונפליקטים ואזהרות
        const conflictCheck = checkScheduleConflict(
            scheduleData.newLesson,
            scheduleData.existingLessons
        );

        if (conflictCheck.hasConflict) {
            console.log('🚫 STUDENT SCHEDULE CONFLICT - BLOCKING REGISTRATION');
            throw new Error(JSON.stringify({
                type: 'SCHEDULE_CONFLICT',
                message: 'יש לך שיעור קיים בזמן חופף',
                conflicts: [conflictCheck.conflictingLesson]
            }));
        }

        const result = await lessonsService.registerStudentToLesson(
            registrationData.lesson_id,
            registrationData.student_id
        );

        if (result.emailData) {
            await sendConfirmationEmail(result.emailData);
        }

        return {
            ...result,
            warnings: conflictCheck.warnings || []
        };

    } catch (error) {
        console.error('Error in registerToLesson:', error);
        throw error;
    }
}

async function sendConfirmationEmail(emailData) {
    try {
        console.log('Sending confirmation email...');

        const icsContent = calendarUtils.createLessonCalendarEvent(emailData);

        const emailResult = await sendLessonConfirmationEmail(
            emailData.student_email,
            emailData.student_name,
            emailData,
            icsContent
        );

        if (emailResult.success) {
            console.log('Email sent successfully');
        } else {
            console.error('Failed to send email:', emailResult.error);
        }

    } catch (error) {
        console.error('Error sending confirmation email:', error.message);
    }
}

module.exports = {
    registerToLesson
};
