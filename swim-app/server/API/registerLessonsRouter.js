const express = require('express');
const router = express.Router();
const registerLessonsController = require('../controllers/registerLessonsController');

router.post('/', async (req, res, next) => {
    try {
        if (!req.body.lesson_id) {
            const error = new Error('נדרש מזהה שיעור');
            throw error;
        }

        const registrationData = {
            lesson_id: req.body.lesson_id,
            student_id: req.user.id
        };

        const newRegistration = await registerLessonsController.registerToLesson(registrationData);

        if (newRegistration.warnings && newRegistration.warnings.length > 0) {
            res.status(201).json({
                success: true,
                data: newRegistration,
                warnings: newRegistration.warnings,
                message: '🎉 נרשמת בהצלחה לשיעור עם אזהרות!'
            });
        } else {
            res.status(201).json({
                success: true,
                data: newRegistration,
                message: '🎉 נרשמת בהצלחה לשיעור!'
            });
        }

    } catch (error) {
        next(error);
    }
});

module.exports = router;
