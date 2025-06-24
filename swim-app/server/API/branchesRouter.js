const express = require('express');
const router = express.Router();
const branchesController = require('../controllers/branchesController');
const verifyToken = require('../middlewares/verifyToken');
const { uploadPoolImage } = require('../services/fileService');

router.get('/', async (req, res) => {
    try {
        console.log('GET /branches called with query:', req.query); 
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

router.post('/', verifyToken, uploadPoolImage.single('image'), async (req, res) => {
    try {

        const branchData = req.body;
        const imageFile = req.file;
        const newBranch = await branchesController.createBranch(branchData, imageFile);

        res.status(201).json({
            success: true,
            data: newBranch,
            message: 'Branch created successfully'
        });

    } catch (error) {

        let errorMessage = 'Error creating branch';
        if (error.message.includes('Image is required')) {
            errorMessage = 'תמונה נדרשת ליצירת בריכה';
        } else if (error.message.includes('רק קבצי תמונה מותרים')) {
            errorMessage = error.message;
        } else if (error.code === 'LIMIT_FILE_SIZE') {
            errorMessage = 'גודל התמונה גדול מדי (מקסימום 5MB)';
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.message
        });
    }
});

router.put('/:id', verifyToken, uploadPoolImage.single('image'), async (req, res) => {
    try {
        const branchId = req.params.id;
        const branchData = req.body;
        const imageFile = req.file; 

        const updatedBranch = await branchesController.updateBranch(branchId, branchData, imageFile);


        res.json({
            success: true,
            data: updatedBranch,
            message: 'Branch updated successfully'
        });

    } catch (error) {

        let errorMessage = 'Error updating branch';
        if (error.message.includes('רק קבצי תמונה מותרים')) {
            errorMessage = error.message;
        } else if (error.code === 'LIMIT_FILE_SIZE') {
            errorMessage = 'גודל התמונה גדול מדי (מקסימום 5MB)';
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.message
        });
    }
});

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
