const express = require('express');
const router = express.Router();
// const branchesController = require('../controllers/branchesController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    try {
        const query = { ...req.query };
        if (query.user_id === 'null' && req.user && req.user.id) {
            query.user_id = req.user.id;
        }
        const branches = await branchesController.getBranches(query);
        res.json({ data: branches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const lessonData = req.body;

        const newBranch = await branchesController.createBranch(lessonData);

        res.status(201).json({
            success: true,
            data: newBranch,
            message: 'Branch created successfully'
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

        await branchesController.deleteBranch(lessonId);

        res.json({
            success: true,
            message: 'Branch deleted successfully'
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