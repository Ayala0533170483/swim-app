const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsController');

router.get('/', async (req, res, next) => {
    try {
        if (Object.keys(req.query).length === 0) {
            const studentId = req.user.id;
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
        const lessons = await lessonsController.getMyLessons(filters);
        res.json({ data: lessons });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const lessonData = req.body;

        const result = await lessonsController.createLesson(lessonData);

        if (result.warnings && result.warnings.length > 0) {
            res.status(201).json({
                success: true,
                data: result.lesson,
                warnings: result.warnings,
                message: 'Lesson created successfully with warnings'
            });
        } else {
            res.status(201).json({
                success: true,
                data: result.lesson || result,
                message: 'Lesson created successfully'
            });
        }

    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const lesson_id = req.params.id;
        const updateData = req.body;

        const result = await lessonsController.updateLesson(lesson_id, updateData);

        res.json({
            success: true,
            message: result.message
        });

    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const lessonId = req.params.id;

        await lessonsController.deleteLesson(lessonId);

        res.json({
            success: true,
            message: 'Lesson deleted successfully'
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
