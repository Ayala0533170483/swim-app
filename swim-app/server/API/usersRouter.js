// const express = require('express');
// const router = express.Router();
// const usersController = require('../controllers/usersController');

// router.get('/', async (req, res) => {
//     try {
//         let query = { ...req.query };
//         if (query.user_id == null && req.user && req.user.id) {
//             query = { 'user_id': req.user.id };
//         }
//         const users = await usersController.getUsers(query);
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });



// // router.post('/', async (req, res) => {
//     try {
//         const userData = req.body;
       

//         const newUser = await usersController.createUser(userData);

//         res.status(201).json({
//             success: true,
//             data: newUser,
//             message: 'User created successfully'
//         });

//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error creating user',
//             error: error.message
//         });
//     }
// });

// router.put('/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const updateData = req.body;

//         const result = await usersController.updateUser(id, updateData);

//         res.json({
//             success: true,
//             data: result,
//             message: 'User updated successfully'
//         });

//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error updating user',
//             error: error.message
//         });
//     }
// });

// router.delete('/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         console.log(`Deleting user with id ${id}`);

//         const result = await usersController.deleteUser(id);

//         res.json({
//             success: true,
//             data: result,
//             message: 'User deleted successfully'
//         });

//     } catch (error) {
//         console.error('Error deleting user:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error deleting user',
//             error: error.message
//         });
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', async (req, res) => {
    try {
        console.log('🔍 Router - Full URL:', req.url); // דיבוג
        console.log('🔍 Router - Query params:', req.query); // דיבוג
        
        let query = { ...req.query };
        
        // בדיקה אם יש teachers או students בquery
        if ('teachers' in req.query || req.url.includes('teachers')) {
            query.type = 'teachers';
            console.log('🔍 Router - Detected teachers request');
        } else if ('students' in req.query || req.url.includes('students')) {
            query.type = 'students';
            console.log('🔍 Router - Detected students request');
        } else if (query.user_id == null && req.user && req.user.id) {
            // הלוגיקה הקיימת שלך למשתמש מחובר
            query = { 'user_id': req.user.id };
            console.log('🔍 Router - Query with user_id:', query);
        }

        console.log('🔍 Router - Final query:', query); // דיבוג
        
        const users = await usersController.getUsers(query);
        console.log('🔍 Router - Users returned:', users.length, 'users');
        res.json(users);
    } catch (error) {
        console.error('❌ Router Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// שאר הנתיבים...
router.post('/', async (req, res) => {
    try {
        const userData = req.body;
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
