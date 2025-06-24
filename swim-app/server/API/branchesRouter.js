const express = require('express');
const router = express.Router();
const branchesController = require('../controllers/branchesController');
const verifyToken = require('../middlewares/verifyToken');
const { uploadPoolImage } = require('../services/fileService');
const authorization = require('../middlewares/authorization.js');

router.get('/', async (req, res, next) => {
    try {
        console.log('GET /branches called with query:', req.query);
        const query = { ...req.query };
        const branches = await branchesController.getBranches(query);
        res.json({
            success: true,
            data: branches
        });

    } catch (error) {
        next(error);
    }
});

router.post('/', verifyToken,authorization, uploadPoolImage.single('image'), async (req, res, next) => {
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
        next(error);
    }
});

router.put('/:id', verifyToken,authorization, uploadPoolImage.single('image'), async (req, res, next) => {
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
        next(error);
    }
});

router.delete('/:id', verifyToken,authorization, async (req, res, next) => {
    try {
        const branchId = req.params.id;
        await branchesController.deleteBranch(branchId);

        res.json({
            success: true,
            message: 'Branch deleted successfully'
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
