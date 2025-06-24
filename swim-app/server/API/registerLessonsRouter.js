const express = require('express');
const router = express.Router();
const registerLessonsController = require('../controllers/registerLessonsController');

router.post('/', async (req, res) => {
    try {
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
        console.error('Error in registration:', error);

        if (error.message.startsWith('{"type":"SCHEDULE_CONFLICT"')) {
            try {
                const conflictData = JSON.parse(error.message);
                res.status(409).json({
                    success: false,
                    type: 'SCHEDULE_CONFLICT',
                    message: conflictData.message,
                    conflicts: conflictData.conflicts
                });
                return;
            } catch (parseError) {
                console.error('Error parsing conflict data:', parseError);
            }
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


module.exports = router;
