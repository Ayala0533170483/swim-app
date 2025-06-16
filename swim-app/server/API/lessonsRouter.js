const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsController');

router.get('/', async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            const studentId = req.user.id; // לקיחת ה-ID מהטוקן
            const availableLessons = await lessonsController.getAvailableLessons(studentId);
            return res.json({ data: availableLessons });
        }

        let query = { ...req.query };
        if (query.user_id == null && req.user && req.user.id) {
            query = { 'user_id': req.user.id };
        }
        const filters = {
            role: req.user.role,
            id: req.user.id
        };
        const lessons = await lessonsController.getLessons(filters);
        res.json({ data: lessons });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const registrationData = {
            lesson_id: req.body.lesson_id,
            student_id: req.body.student_id || req.user.id
        };

        const newRegistration = await lessonsController.registerToLesson(registrationData);

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

router.post('/', async (req, res) => {
    try {
        const lessonData = req.body;

        const newLesson = await lessonsController.createLesson(lessonData);

        res.status(201).json({
            success: true,
            data: newLesson,
            message: 'Lesson created successfully'
        });

    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating lesson',
            error: error.message
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        const registrationData = {
            lesson_id: req.body.lesson_id,
            student_id: req.body.student_id || req.user.id
        };

        const newRegistration = await lessonsController.registerToLesson(registrationData);

        res.status(201).json({
            success: true,
            data: newRegistration,
            message: 'נרשמת בהצלחה לשיעור!'
        });

    } catch (error) {
        console.error('Error registering to lesson:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה ברישום לשיעור',
            error: error.message
        });
    }
});



router.put('/:id', async (req, res) => {
    try {
        const lesson_id = req.params.id;
        const updateData = req.body;

        const result = await lessonsController.updateLesson(lesson_id, updateData);

        res.json({
            success: true,
            message: result.message
        });

    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating lesson',
            error: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const lessonId = req.params.id;

        await lessonsController.deleteLesson(lessonId);

        res.json({
            success: true,
            message: 'Lesson deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting lesson',
            error: error.message
        });
    }
});

module.exports = router;
