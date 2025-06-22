const { createTransporter } = require('../config/emailTransporter');
const { createLessonConfirmationTemplate } = require('../templates/emailRegisterlessonsTemplates');

const sendLessonConfirmationEmail = async (studentEmail, studentName, lessonData, icsContent) => {
    try {
        const transporter = createTransporter();
        const htmlContent = createLessonConfirmationTemplate(studentName, lessonData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: `🏊‍♀️ אישור רישום לשיעור שחייה`,
            html: htmlContent,
            attachments: [
                {
                    filename: 'שיעור_שחייה.ics',
                    content: icsContent,
                    contentType: 'text/calendar'
                }
            ]
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

const sendCancellationEmail = async (studentEmail, studentName, lessonData) => {
    // פונקציה לשליחת מייל ביטול
};

module.exports = {
    sendLessonConfirmationEmail,
    sendCancellationEmail
};
