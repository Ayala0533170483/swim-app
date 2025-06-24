const lessonsService = require('../services/lessonsService');
const { sendLessonConfirmationEmail } = require('./emailsController');
const calendarUtils = require('../utils/calendarUtils');
const { checkScheduleConflict } = require('../utils/timeUtils');
const { log } = require('../utils/logger');

async function registerToLesson(registrationData) {
    try {

        const scheduleData = await lessonsService.getLessonAndStudentSchedule(
            registrationData.lesson_id,
            registrationData.student_id
        );

        if (!scheduleData.newLesson) {
            throw new Error('השיעור לא נמצא או שהוא לא פעיל');
        }

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

        log('Student registered to lesson successfully', {
            studentId: registrationData.student_id,
            lessonId: registrationData.lesson_id,
            registrationId: result.registrationId,
            warnings: conflictCheck.warnings?.length || 0
        });

        return {
            ...result,
            warnings: conflictCheck.warnings || []
        };

    } catch (error) {
        if (error.message.startsWith('{"type":"SCHEDULE_CONFLICT"')) {
            log('Failed to register student - schedule conflict', {
                studentId: registrationData.student_id,
                lessonId: registrationData.lesson_id
            });
        } else {
            log('Failed to register student to lesson', {
                studentId: registrationData.student_id,
                lessonId: registrationData.lesson_id,
                error: error.message
            });
        }
        throw error;
    }
}

async function sendConfirmationEmail(emailData) {
    try {

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
