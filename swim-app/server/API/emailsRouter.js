const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendGeneralMessage } = require('../controllers/emailsController');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB מקסימום
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('סוג קובץ לא נתמך'), false);
        }
    }
});

router.post('/send-general-message', upload.single('attachedFile'), async (req, res, next) => {
    try {
        const { userIds, subject, messageContent, recipients } = req.body;

        if (!userIds || !Array.isArray(JSON.parse(userIds)) || JSON.parse(userIds).length === 0) {
            const error = new Error('נדרש לבחור לפחות משתמש אחד');
            throw error;
        }

        if (!subject || !subject.trim()) {
            const error = new Error('נדרש נושא להודעה');
            throw error;
        }

        if (!messageContent || !messageContent.trim()) {
            const error = new Error('נדרש תוכן להודעה');
            throw error;
        }

        if (!recipients || !Array.isArray(JSON.parse(recipients)) || JSON.parse(recipients).length === 0) {
            const error = new Error('נדרשים פרטי נמענים');
            throw error;
        }

        const recipientsList = JSON.parse(recipients);
        const result = await sendGeneralMessage(
            recipientsList,
            subject.trim(),
            messageContent.trim(),
            req.file
        );

        if (result.totalSent > 0) {
            res.json({
                success: true,
                message: `ההודעה נשלחה בהצלחה ל-${result.totalSent} משתמשים`,
                totalSent: result.totalSent,
                totalFailed: result.totalFailed,
                details: result.results
            });
        } else {
            const error = new Error('שגיאה בשליחת ההודעות');
            error.totalSent = result.totalSent;
            error.totalFailed = result.totalFailed;
            error.details = result.results;
            throw error;
        }

    } catch (error) {
        next(error); 
    }
});

module.exports = router;
