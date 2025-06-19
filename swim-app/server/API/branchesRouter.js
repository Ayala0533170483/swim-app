const express = require('express');
const router = express.Router();
const branchesController = require('../controllers/branchesController'); 
const verifyToken = require('../middleware/verifyToken');

router.get('/', async (req, res) => {
    try {
        const query = { ...req.query };
        const branches = await branchesController.getBranches(query);
        res.json({ 
            success: true,
            data: branches 
        });
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// POST - ליצור בריכה חדשה (רק למנהלים)
router.post('/', verifyToken, async (req, res) => {
    try {
        const branchData = req.body;
        const newBranch = await branchesController.createBranch(branchData);

        res.status(201).json({
            success: true,
            data: newBranch,
            message: 'Branch created successfully'
        });

    } catch (error) {
        console.error('Error creating branch:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating branch',
            error: error.message
        });
    }
});

// PUT - לעדכון בריכה (רק למנהלים)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const branchId = req.params.id;
        const branchData = req.body;

        const updatedBranch = await branchesController.updateBranch(branchId, branchData);

        res.json({
            success: true,
            data: updatedBranch,
            message: 'Branch updated successfully'
        });

    } catch (error) {
        console.error('Error updating branch:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating branch',
            error: error.message
        });
    }
});

// DELETE - למחיקת בריכה (רק למנהלים)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const branchId = req.params.id;
        await branchesController.deleteBranch(branchId);

        res.json({
            success: true,
            message: 'Branch deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting branch:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting branch',
            error: error.message
        });
    }
});

module.exports = router;
