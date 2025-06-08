const express = require('express');
const router = express.Router();
const poolsController = require('../controllers/poolsController');

// נתיב לקבלת כל הבריכות
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
module.exports = router;