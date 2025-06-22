const { createTransporter } = require('../config/emailTransporter');
const { createLessonConfirmationTemplate } = require('../templates/emailRegisterlessonsTemplate');
const { createGeneralMessageTemplate } = require('../templates/emailGeneralMessageTemplate');
const { createUserRemovalTemplate } = require('../templates/emailUserRemovalTemplate');
const { createLessonCancellationTemplate } = require('../templates/emailLessonCancellationTemplate');
const cleanFileName = (originalName) => {
    return originalName
        .replace(/[^\w\s.-]/g, '') // הסרת תווים מיוחדים
        .replace(/\s+/g, '_')      // החלפת רווחים בקו תחתון
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
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Error sending email:', error);
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

                // הוספת קובץ מצורף אם קיים
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

        // בדיקה כמה הצליחו
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        return {
            success: successful > 0,
            totalSent: successful,
            totalFailed: failed,
            results: results
        };

    } catch (error) {
        console.error('Error in sendGeneralMessage:', error);
        return {
            success: false,
            error: error.message,
            totalSent: 0,
            totalFailed: recipients.length
        };
    }
};

const sendCancellationEmail = async (studentEmail, studentName, lessonData) => {
    // פונקציה לשליחת מייל ביטול
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
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error(`Error sending user removal email to ${userEmail}:`, error);
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
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error(`Error sending lesson cancellation email to ${teacherEmail}:`, error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendLessonConfirmationEmail,
    sendGeneralMessage,
    sendCancellationEmail,
    sendUserRemovalEmail,
    sendLessonCancellationEmail
};
