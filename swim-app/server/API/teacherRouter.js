const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// נתיבים דינמיים לפי סוג הפריט
router.post('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const itemData = req.body;
        
        const newItem = await teacherController.createItem(type, itemData);
        res.json(newItem);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const filters = req.query;
        
        const items = await teacherController.getItems(type, filters);
        res.json(items);
    } catch (error) {
        console.error('Error getting items:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const updateData = req.body;
        
        await teacherController.updateItem(type, id, updateData);
        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        
        await teacherController.deleteItem(type, id);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
