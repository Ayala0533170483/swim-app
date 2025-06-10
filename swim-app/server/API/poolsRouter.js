const express = require('express');
const router = express.Router();
const poolsController = require('../controllers/poolsController');


router.get('/', async (req, res) => {
    try {
        const filters = req.query;
        const items = await poolsController.getItems('all', filters);

        res.json({
            success: true,
            data: items
        });

    } catch (error) {
        console.error('Error getting pools:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading pools',
            error: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const pool = req.body;

        const newItem = await usersController.createItem(pool);

        res.status(201).json({
            success: true,
            data: newItem,
            message: 'pool created successfully'
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating pool',
            error: error.message
        });
    }
});
module.exports = router;