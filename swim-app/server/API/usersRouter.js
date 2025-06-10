const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', async (req, res) => {
    try {
        const query = { ...req.query };
        if (query.user_id === 'null' && req.user && req.user.id) {
            query.user_id = req.user.id;
        }
        const users = await usersController.getUsers(query);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const userData = req.body;
        console.log('Creating new user:', userData);

        const newUser = await usersController.createUser(userData);

        res.status(201).json({
            success: true,
            data: newUser,
            message: 'User created successfully'
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        const result = await usersController.updateUser(id, updateData);

        res.json({
            success: true,
            data: result,
            message: 'User updated successfully'
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`Deleting user with id ${id}`);

        const result = await usersController.deleteUser(id);

        res.json({
            success: true,
            data: result,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

module.exports = router;
