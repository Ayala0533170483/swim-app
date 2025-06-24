const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', async (req, res, next) => {
    try {
        let query = { ...req.query };

        if ('teachers' in req.query || req.url.includes('teachers')) {
            query.type = 'teachers';
        } else if ('students' in req.query || req.url.includes('students')) {
            query.type = 'students';
        } else if (Object.keys(req.query).length === 0) {
            query = {};
        } else if (query.user_id == null && req.user && req.user.id) {
            query = { 'user_id': req.user.id };
        }

        const users = await usersController.getUsers(query);
        res.json(users);
    } catch (error) {
        next(error); 
    }
});

router.post('/', async (req, res, next) => {
    try {
        const userData = req.body;
        const newUser = await usersController.createUser(userData);

        res.status(201).json({
            success: true,
            data: newUser,
            message: 'User created successfully'
        });

    } catch (error) {
        next(error); 
    }
});

router.put('/:id', async (req, res, next) => {
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
        next(error); 
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const additionalData = req.body;

        const result = await usersController.deleteUser(id, additionalData);

        res.json({
            success: true,
            data: result,
            message: 'User deleted successfully'
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
