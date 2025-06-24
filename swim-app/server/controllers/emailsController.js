const { createTransporter } = require('../config/emailTransporter');
const { createLessonConfirmationTemplate } = require('./templates/emailRequestTemplate');
const { createGeneralMessageTemplate } = require('./templates/emailGeneralMessageTemplate');
const { createUserRemovalTemplate } = require('./templates/emailUserRemovalTemplate');
const { createLessonCancellationTemplate } = require('./templates/emailLessonCancellationTemplate');
const { emailRegisterlessonsTemplate } = require('./templates/emailLessonRequestTemplate');
const { log } = require('../utils/logger');

const cleanFileName = (originalName) => {
    return originalName
        .replace(/[^\w\s.-]/g, '') 
        .replace(/\s+/g, '_')      
        .trim();
};

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
        
        log('Lesson confirmation email sent', { studentEmail: studentEmail, lessonId: lessonData.lesson_id, messageId: result.messageId });
        
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Error sending email:', error);
        
        log('Failed to send lesson confirmation email', { studentEmail: studentEmail, error: error.message });
        
        return { success: false, error: error.message };
    }
};

const sendGeneralMessage = async (recipients, subject, messageContent, attachedFile = null) => {
    try {
        const transporter = createTransporter();
        const results = [];

        for (const recipient of recipients) {
            try {
                const htmlContent = createGeneralMessageTemplate(
                    recipient.name,
                    subject,
                    messageContent
                );

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: recipient.email,
                    subject: subject,
                    html: htmlContent
                };

                if (attachedFile) {
                    mailOptions.attachments = [
                        {
                            filename: cleanFileName(attachedFile.originalname),
                            content: attachedFile.buffer,
                            contentType: attachedFile.mimetype
                        }
                    ];
                }

                const result = await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${recipient.email}:`, result.messageId);

                results.push({
                    email: recipient.email,
                    name: recipient.name,
                    success: true,
                    messageId: result.messageId
                });

            } catch (emailError) {
                console.error(`Error sending email to ${recipient.email}:`, emailError);
                results.push({
                    email: recipient.email,
                    name: recipient.name,
                    success: false,
                    error: emailError.message
                });
            }
        }

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        log('General message emails sent', { totalRecipients: recipients.length, successful: successful, failed: failed, subject: subject });

        return {
            success: successful > 0,
            totalSent: successful,
            totalFailed: failed,
            results: results
        };

    } catch (error) {
        console.error('Error in sendGeneralMessage:', error);
        
        log('Failed to send general message emails', { totalRecipients: recipients.length, subject: subject, error: error.message });
        
        return {
            success: false,
            error: error.message,
            totalSent: 0,
            totalFailed: recipients.length
        };
    }
};

const sendUserRemovalEmail = async (userEmail, userName, userType) => {
    try {
        const transporter = createTransporter();
        const htmlContent = createUserRemovalTemplate(userName, userType);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `SWIMWISE - הסרה מהמערכת`,
            html: htmlContent
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`User removal email sent to ${userEmail}:`, result.messageId);
        
        log('User removal email sent', { userEmail: userEmail, userType: userType, messageId: result.messageId });
        
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error(`Error sending user removal email to ${userEmail}:`, error);
        
        log('Failed to send user removal email', { userEmail: userEmail, userType: userType, error: error.message });
        
        return { success: false, error: error.message };
    }
};

const sendLessonCancellationEmail = async (teacherEmail, teacherName, lessonData) => {
    try {
        const transporter = createTransporter();
        const htmlContent = createLessonCancellationTemplate(teacherName, lessonData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: teacherEmail,
            subject: `SWIMWISE - ביטול שיעור שחייה`,
            html: htmlContent
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`Lesson cancellation email sent to ${teacherEmail}:`, result.messageId);
        
        log('Lesson cancellation email sent', { teacherEmail: teacherEmail, lessonId: lessonData.lesson_id, messageId: result.messageId });
        
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error(`Error sending lesson cancellation email to ${teacherEmail}:`, error);
        
        log('Failed to send lesson cancellation email', { teacherEmail: teacherEmail, lessonId: lessonData.lesson_id, error: error.message });
        
        return { success: false, error: error.message };
    }
};

const sendLessonRequestStatusEmail = async (studentEmail, studentName, teacherName, requestData, status) => {
    try {
        const transporter = createTransporter();
        const htmlContent = emailRegisterlessonsTemplate(studentName, teacherName, requestData, status);

        const subject = status === 'approved'
            ? `🎉 SWIMWISE - בקשת השיעור שלך אושרה!`
            : `😔 SWIMWISE - בקשת השיעור שלך נדחתה`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: subject,
            html: htmlContent
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`Lesson request status email sent to ${studentEmail}:`, result.messageId);
        
        log('Lesson request status email sent', { studentEmail: studentEmail, requestId: requestData.request_id, status: status, messageId: result.messageId });
        
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error(`Error sending lesson request status email to ${studentEmail}:`, error);
        
        log('Failed to send lesson request status email', { studentEmail: studentEmail, requestId: requestData.request_id, status: status, error: error.message });
        
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendLessonConfirmationEmail,
    sendGeneralMessage,
    sendUserRemovalEmail,
    sendLessonCancellationEmail,
    sendLessonRequestStatusEmail
};
