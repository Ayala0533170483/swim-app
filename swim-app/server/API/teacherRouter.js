const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// נתיבים דינמיים לפי סוג הפריט
router.post('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const itemData = req.body;
        
        console.log(`=== ROUTER: POST /${type} ===`);
        console.log('Request body:', JSON.stringify(itemData, null, 2));
        
        const newItem = await teacherController.createItem(type, itemData);
        
        console.log('=== ROUTER: Success ===');
        console.log('Sending response:', JSON.stringify(newItem, null, 2));
        
        res.status(201).json(newItem);
    } catch (error) {
        console.error('=== ROUTER: Error ===');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error sqlMessage:', error.sqlMessage);
        
        let statusCode = 500;
        let errorMessage = error.message;
        
        if (error.message.includes('שדות חובה חסרים')) {
            statusCode = 400;
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
            statusCode = 400;
            errorMessage = 'Table does not exist';
        } else if (error.code === 'ER_BAD_FIELD_ERROR') {
            statusCode = 400;
            errorMessage = 'Invalid field name';
        }
        
        res.status(statusCode).json({ 
            error: errorMessage,
            details: error.sqlMessage || error.message 
        });
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
