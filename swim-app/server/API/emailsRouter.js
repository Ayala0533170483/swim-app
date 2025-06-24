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

router.post('/send-general-message', upload.single('attachedFile'), async (req, res) => {
    try {
        const { userIds, subject, messageContent, recipients } = req.body;

        if (!userIds || !Array.isArray(JSON.parse(userIds)) || JSON.parse(userIds).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'נדרש לבחור לפחות משתמש אחד'
            });
        }

        if (!subject || !subject.trim()) {
            return res.status(400).json({
                success: false,
                error: 'נדרש נושא להודעה'
            });
        }

        if (!messageContent || !messageContent.trim()) {
            return res.status(400).json({
                success: false,
                error: 'נדרש תוכן להודעה'
            });
        }

        if (!recipients || !Array.isArray(JSON.parse(recipients)) || JSON.parse(recipients).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'נדרשים פרטי נמענים'
            });
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
            res.status(500).json({
                success: false,
                error: 'שגיאה בשליחת ההודעות',
                totalSent: result.totalSent,
                totalFailed: result.totalFailed,
                details: result.results
            });
        }

    } catch (error) {
        console.error('Error in send-general-message route:', error);
        res.status(500).json({
            success: false,
            error: 'שגיאה בשרת: ' + error.message
        });
    }
});

module.exports = router;
