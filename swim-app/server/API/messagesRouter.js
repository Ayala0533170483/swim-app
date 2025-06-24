const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const verifyToken = require('../middlewares/verifyToken');
const authorization = require('../middlewares/authorization.js');

router.get('/', verifyToken,authorization, async (req, res, next) => {
    try {
        const result = await messagesController.getMessages(req.query, req.user);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const result = await messagesController.createMessage(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', verifyToken,authorization, async (req, res, next) => {
    try {
        const result = await messagesController.updateMessage(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', verifyToken,authorization, async (req, res, next) => {
    try {
        const result = await messagesController.deleteMessage(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
