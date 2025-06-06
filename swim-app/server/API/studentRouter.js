const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const filters = req.query;
        
        console.log(`Getting ${type} with filters:`, filters);
        
        const items = await studentController.getItems(type, filters);
        
        res.json({
            success: true,
            data: items
        });
        
    } catch (error) {
        console.error(`Error getting ${type}:`, error);
        res.status(500).json({ 
            success: false, 
            message: `Error loading ${type}`,
            error: error.message 
        });
    }
});

router.post('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const itemData = req.body;
        
        console.log(`Creating new ${type}:`, itemData);
        
        const newItem = await studentController.createItem(type, itemData);
        
        res.status(201).json({
            success: true,
            data: newItem,
            message: `${type} created successfully`
        });
        
    } catch (error) {
        console.error(`Error creating ${req.params.type}:`, error);
        res.status(500).json({ 
            success: false, 
            message: `Error creating ${req.params.type}`,
            error: error.message 
        });
    }
});

router.put('/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const updateData = req.body;
        
        console.log(`Updating ${type} with id ${id}:`, updateData);
        
        const result = await studentController.updateItem(type, id, updateData);
        
        res.json({
            success: true,
            data: result,
            message: `${type} updated successfully`
        });
        
    } catch (error) {
        console.error(`Error updating ${req.params.type}:`, error);
        res.status(500).json({ 
            success: false, 
            message: `Error updating ${req.params.type}`,
            error: error.message 
        });
    }
});

router.delete('/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        
        console.log(`Deleting ${type} with id ${id}`);
        
        const result = await studentController.deleteItem(type, id);
        
        res.json({
            success: true,
            data: result,
            message: `${type} deleted successfully`
        });
        
    } catch (error) {
        console.error(`Error deleting ${req.params.type}:`, error);
        res.status(500).json({ 
            success: false, 
            message: `Error deleting ${req.params.type}`,
            error: error.message 
        });
    }
});

module.exports = router;
