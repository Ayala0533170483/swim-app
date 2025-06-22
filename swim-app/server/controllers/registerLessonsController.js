const lessonsService = require('../services/lessonsService');
// במקום EmailService, השתמש בקובץ הקיים:
const { sendLessonConfirmationEmail } = require('./emailController');
const calendarUtils = require('../utils/calendarUtils');

async function registerToLesson(registrationData) {
    try {
        console.log('Registering student to lesson:', registrationData);

        const result = await lessonsService.registerStudentToLesson(
            registrationData.lesson_id,
            registrationData.student_id
        );

        // שליחת מייל אישור
        if (result.emailData) {
            await sendConfirmationEmail(result.emailData);
        }

        return result;
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
        // לא זורקים שגיאה - הרישום כבר הצליח
    }
}

module.exports = {
    registerToLesson
};
