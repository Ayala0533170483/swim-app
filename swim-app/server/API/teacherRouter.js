const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// נתיב כללי לקבלת פריטים (כולל users עבור פרופיל)
router.get('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const filters = req.query;

        console.log(`Getting ${type} with filters:`, filters);

        const items = await teacherController.getItems(type, filters);

        res.json({
            success: true,
            data: items
        });

    } catch (error) {
        console.error(`Error getting ${type}:`, error);
        res.status(500).json({
            success: false,
            message: `שגיאה בטעינת ${type}`,
            error: error.message
        });
    }
});

// נתיב ליצירת פריט חדש
router.post('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const itemData = req.body;

        console.log(`Creating new ${type}:`, itemData);

        const newItem = await teacherController.createItem(type, itemData);

        res.status(201).json({
            success: true,
            data: newItem,
            message: `${type} נוצר בהצלחה`
        });

    } catch (error) {
        console.error(`Error creating ${req.params.type}:`, error);
        res.status(500).json({
            success: false,
            message: `שגיאה ביצירת ${req.params.type}`,
            error: error.message
        });
    }
});

// נתיב לעדכון פריט
router.put('/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const updateData = req.body;

        console.log(`Updating ${type} with id ${id}:`, updateData);

        const result = await teacherController.updateItem(type, id, updateData);

        res.json({
            success: true,
            data: result,
            message: `${type} עודכן בהצלחה`
        });

    } catch (error) {
        console.error(`Error updating ${req.params.type}:`, error);
        res.status(500).json({
            success: false,
            message: `שגיאה בעדכון ${req.params.type}`,
            error: error.message
        });
    }
});

// נתיב למחיקת פריט
router.delete('/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;

        console.log(`Deleting ${type} with id ${id}`);

        const result = await teacherController.deleteItem(type, id);

        res.json({
            success: true,
            data: result,
            message: `${type} נמחק בהצלחה`
        });

    } catch (error) {
        console.error(`Error deleting ${req.params.type}:`, error);
        res.status(500).json({
            success: false,
            message: `שגיאה במחיקת ${req.params.type}`,
            error: error.message
        });
    }
});

module.exports = router;
