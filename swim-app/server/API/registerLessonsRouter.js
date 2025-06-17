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

        res.status(201).json({
            success: true,
            data: newRegistration,
            message: '🎉 נרשמת בהצלחה לשיעור!'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
module.exports = router;