const express = require('express');
const router = express.Router();
const branchesController = require('../controllers/branchesController');
const verifyToken = require('../middleware/verifyToken');
const { uploadPoolImage } = require('../services/fileService');

router.get('/', async (req, res) => {
    try {
        console.log('GET /branches called with query:', req.query); // הוסף את זה
        const query = { ...req.query };
        const branches = await branchesController.getBranches(query);
        console.log('Branches found:', branches); // הוסף את זה
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
        console.log('POST /pools - Body:', req.body);
        console.log('POST /pools - File:', req.file);

        const branchData = req.body;
        const imageFile = req.file;

        const newBranch = await branchesController.createBranch(branchData, imageFile);

        console.log('POST /pools - Created branch:', newBranch);

        res.status(201).json({
            success: true,
            data: newBranch,
            message: 'Branch created successfully'
        });

    } catch (error) {
        console.error('Error creating branch:', error);

        // הודעות שגיאה ספציפיות
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

// PUT - לעדכון בריכה (עם תמונה אופציונלית)
router.put('/:id', verifyToken, uploadPoolImage.single('image'), async (req, res) => {
    try {
        const branchId = req.params.id;
        const branchData = req.body;
        const imageFile = req.file; // אופציונלי בעדכון

        console.log('PUT /pools/:id - ID from URL:', branchId, 'Body:', branchData);
        console.log('PUT /pools/:id - File:', imageFile);

        const updatedBranch = await branchesController.updateBranch(branchId, branchData, imageFile);

        console.log('PUT /pools/:id - Updated branch:', updatedBranch);

        res.json({
            success: true,
            data: updatedBranch,
            message: 'Branch updated successfully'
        });

    } catch (error) {
        console.error('Error updating branch:', error);

        // הודעות שגיאה ספציפיות
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

// DELETE - למחיקת בריכה (לא משתנה)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const branchId = req.params.id;

        console.log('DELETE /pools/:id - ID:', branchId);

        await branchesController.deleteBranch(branchId);

        console.log('DELETE /pools/:id - Success');

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
