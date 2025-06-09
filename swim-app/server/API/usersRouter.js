const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// GET route
router.get('/:type/:id?', async (req, res) => {
    try {
        const type = req.params.type;
        const filters = req.query;
        if (req.params.id) {
            filters.id = req.params.id;
        }
        const items = await usersController.getItems(type, filters, id);

        res.json({
            success: true,
            data: items
        });

    } catch (error) {
        console.error(`Error getting items:`, error);
        res.status(500).json({
            success: false,
            message: `Error loading items`,
            error: error.message
        });
    }
});

// POST route
router.post('/:type', async (req, res) => {
    try {
        const type = req.params.type;
        const itemData = req.body;

        console.log(`Creating new ${type}:`, itemData);

        const newItem = await usersController.createItem(type, itemData);

        res.status(201).json({
            success: true,
            data: newItem,
            message: `${type} created successfully`
        });

    } catch (error) {
        console.error(`Error creating item:`, error);
        res.status(500).json({
            success: false,
            message: `Error creating item`,
            error: error.message
        });
    }
});

// PUT route
router.put('/:type/:id', async (req, res) => {
    try {
        const type = req.params.type;
        const id = req.params.id;
        const updateData = req.body;

        const result = await usersController.updateItem(type, id, updateData);

        res.json({
            success: true,
            data: result,
            message: `${type} updated successfully`
        });

    } catch (error) {
        console.error(`Error updating item:`, error);
        res.status(500).json({
            success: false,
            message: `Error updating item`,
            error: error.message
        });
    }
});

// DELETE route
router.delete('/:type/:id', async (req, res) => {
    try {
        const type = req.params.type;
        const id = req.params.id;

        console.log(`Deleting ${type} with id ${id}`);

        const result = await usersController.deleteItem(type, id);

        res.json({
            success: true,
            data: result,
            message: `${type} deleted successfully`
        });

    } catch (error) {
        console.error(`Error deleting item:`, error);
        res.status(500).json({
            success: false,
            message: `Error deleting item`,
            error: error.message
        });
    }
});

module.exports = router;
