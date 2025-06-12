const express = require('express');
const router = express.Router();
// const messagesController = require('../controllers/messagesController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    try {
        const query = { ...req.query };
        if (query.user_id === 'null' && req.user && req.user.id) {
            query.user_id = req.user.id;
        }
        const messages = await messagesController.getMessages(query);
        res.json({ data: messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const lessonData = req.body;

        const newMessage = await messagesController.createMessage(lessonData);

        res.status(201).json({
            success: true,
            data: newMessage,
            message: 'Message created successfully'
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

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const lessonId = req.params.id;

        await messagesController.deleteMessage(lessonId);

        res.json({
            success: true,
            message: 'Message deleted successfully'
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