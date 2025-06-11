const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsController');

router.get('/', async (req, res) => {
    try {
        const filters = req.query;
        const lessons = await lessonsController.getLessons(filters);

        res.json({
            success: true,
            data: lessons,
            count: lessons.length
        });

    } catch (error) {
        console.error('Error getting lessons:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading lessons',
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

router.put('/:id', async (req, res) => {
    try {
        const lessonId = req.params.id;
        const updateData = req.body;

        const result = await lessonsController.updateLesson(lessonId, updateData);

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