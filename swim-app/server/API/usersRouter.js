// // const express = require('express');
// // const router = express.Router();
// // const usersController = require('../controllers/usersController');

// // router.get('/', async (req, res) => {
// //     try {
// //         console.log('🔍 Router - Full URL:', req.url);
// //         console.log('🔍 Router - Query params:', req.query);

// //         let query = { ...req.query };

// //         // בדיקה אם יש teachers או students בquery
// //         if ('teachers' in req.query || req.url.includes('teachers')) {
// //             query.type = 'teachers';
// //             console.log('🔍 Router - Detected teachers request');
// //         } else if ('students' in req.query || req.url.includes('students')) {
// //             query.type = 'students';
// //             console.log('🔍 Router - Detected students request');
// //         } else if (Object.keys(req.query).length === 0) {
// //             // אם אין query parameters בכלל - החזר את כל המשתמשים
// //             query = {};
// //             console.log('🔍 Router - No query params - returning all users');
// //         } else if (query.user_id == null && req.user && req.user.id) {
// //             // רק אם יש query parameters אחרים אבל לא user_id
// //             query = { 'user_id': req.user.id };
// //             console.log('🔍 Router - Query with user_id:', query);
// //         }

// //         console.log('🔍 Router - Final query:', query);

// //         const users = await usersController.getUsers(query);
// //         console.log('🔍 Router - Users returned:', users.length, 'users');
// //         res.json(users);
// //     } catch (error) {
// //         console.error('❌ Router Error:', error);
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // router.post('/', async (req, res) => {
// //     try {
// //         const userData = req.body;
// //         const newUser = await usersController.createUser(userData);

// //         res.status(201).json({
// //             success: true,
// //             data: newUser,
// //             message: 'User created successfully'
// //         });

// //     } catch (error) {
// //         console.error('Error creating user:', error);
// //         res.status(500).json({
// //             success: false,
// //             message: 'Error creating user',
// //             error: error.message
// //         });
// //     }
// // });

// // router.put('/:id', async (req, res) => {
// //     try {
// //         const id = req.params.id;
// //         const updateData = req.body;

// //         const result = await usersController.updateUser(id, updateData);

// //         res.json({
// //             success: true,
// //             data: result,
// //             message: 'User updated successfully'
// //         });

// //     } catch (error) {
// //         console.error('Error updating user:', error);
// //         res.status(500).json({
// //             success: false,
// //             message: 'Error updating user',
// //             error: error.message
// //         });
// //     }
// // });

// // router.delete('/:id', async (req, res) => {
// //     try {
// //         const id = req.params.id;
// //         const additionalData = req.body; // קבלת הנתונים הנוספים מהגוף הבקשה

// //         console.log(`Deleting user with id ${id}`);
// //         console.log('Additional data:', additionalData); // לדיבוג

// //         const result = await usersController.deleteUser(id, additionalData);

// //         res.json({
// //             success: true,
// //             data: result,
// //             message: 'User deleted successfully'
// //         });

// //     } catch (error) {
// //         console.error('Error deleting user:', error);
// //         res.status(500).json({
// //             success: false,
// //             message: 'Error deleting user',
// //             error: error.message
// //         });
// //     }
// //     // הוסף את זה בסוף הקובץ, לפני module.exports:

// //     // קבלת רשימת מורים
// //     router.get('/teachers', async (req, res) => {
// //         try {
// //             const sql = `
// //             SELECT u.user_id, u.name, u.email 
// //             FROM users u
// //             JOIN user_types ut ON u.type_id = ut.type_id
// //             WHERE ut.type_name = 'teacher' AND u.is_active = 1
// //             ORDER BY u.name
// //         `;

// //             const pool = require('../services/connection');
// //             const [teachers] = await pool.query(sql);

// //             console.log(`Found ${teachers.length} teachers`);

// //             res.json({
// //                 success: true,
// //                 data: teachers
// //             });

// //         } catch (error) {
// //             console.error('Error fetching teachers:', error);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'שגיאה בטעינת המורים',
// //                 error: error.message
// //             });
// //         }
// //     });

// // });



// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const usersController = require('../controllers/usersController');

// router.get('/', async (req, res) => {
//     try {
//         console.log('🔍 Router - Full URL:', req.url);
//         console.log('🔍 Router - Query params:', req.query);

//         let query = { ...req.query };

//         // בדיקה אם יש teachers או students בquery
//         if ('teachers' in req.query || req.url.includes('teachers')) {
//             query.type = 'teachers';
//             console.log('🔍 Router - Detected teachers request');
//         } else if ('students' in req.query || req.url.includes('students')) {
//             query.type = 'students';
//             console.log('🔍 Router - Detected students request');
//         } else if (Object.keys(req.query).length === 0) {
//             // אם אין query parameters בכלל - החזר את כל המשתמשים
//             query = {};
//             console.log('🔍 Router - No query params - returning all users');
//         } else if (query.user_id == null && req.user && req.user.id) {
//             // רק אם יש query parameters אחרים אבל לא user_id
//             query = { 'user_id': req.user.id };
//             console.log('🔍 Router - Query with user_id:', query);
//         }

//         console.log('🔍 Router - Final query:', query);

//         const users = await usersController.getUsers(query);
//         console.log('🔍 Router - Users returned:', users.length, 'users');
//         res.json(users);
//     } catch (error) {
//         console.error('❌ Router Error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// router.post('/', async (req, res) => {
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
//         const additionalData = req.body;

//         console.log(`Deleting user with id ${id}`);
//         console.log('Additional data:', additionalData);

//         const result = await usersController.deleteUser(id, additionalData);

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

// // קבלת רשימת מורים
// router.get('/teachers', async (req, res) => {
//     try {
//         console.log('🔍 Teachers endpoint called');

//         const sql = `
//             SELECT u.user_id, u.name, u.email 
//             FROM users u
//             JOIN user_types ut ON u.type_id = ut.type_id
//             WHERE ut.type_name = 'teacher' AND u.is_active = 1
//             ORDER BY u.name
//         `;

//         const pool = require('../services/connection');
//         const [teachers] = await pool.query(sql);

//         console.log(`🔍 Found ${teachers.length} teachers:`, teachers);

//         res.json({
//             success: true,
//             data: teachers
//         });

//     } catch (error) {
//         console.error('❌ Error fetching teachers:', error);
//         res.status(500).json({
//             success: false,
//             message: 'שגיאה בטעינת המורים',
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
        console.log('🔍 Router - Full URL:', req.url);
        console.log('🔍 Router - Query params:', req.query);

        let query = { ...req.query };

        if ('teachers' in req.query || req.url.includes('teachers')) {
            query.type = 'teachers';
            console.log('🔍 Router - Detected teachers request');
        } else if ('students' in req.query || req.url.includes('students')) {
            query.type = 'students';
            console.log('🔍 Router - Detected students request');
        } else if (Object.keys(req.query).length === 0) {
            query = {};
            console.log('🔍 Router - No query params - returning all users');
        } else if (query.user_id == null && req.user && req.user.id) {
            query = { 'user_id': req.user.id };
            console.log('🔍 Router - Query with user_id:', query);
        }

        console.log('🔍 Router - Final query:', query);

        const users = await usersController.getUsers(query);
        console.log('🔍 Router - Users returned:', users.length, 'users');
        res.json(users);
    } catch (error) {
        console.error('❌ Router Error:', error);
        res.status(500).json({ error: error.message });
    }
});

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
        const additionalData = req.body;

        console.log(`Deleting user with id ${id}`);
        console.log('Additional data:', additionalData);

        const result = await usersController.deleteUser(id, additionalData);

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
