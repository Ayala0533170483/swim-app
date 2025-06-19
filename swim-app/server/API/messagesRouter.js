const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await messagesController.getMessages(req.query, req.user);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.error
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await messagesController.createMessage(req.body);
        res.status(201).json(result);
    } catch (error) {
        const response = {
            success: false,
            message: error.message,
            error: error.error
        };
        
        if (error.received) {
            response.received = error.received;
        }
        
        res.status(error.statusCode || 500).json(response);
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const result = await messagesController.updateMessage(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.error
        });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await messagesController.deleteMessage(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.error
        });
    }
});

module.exports = router;